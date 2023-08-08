from flask import Flask, jsonify, request
from llama_index import SimpleDirectoryReader, StorageContext, Document, load_index_from_storage
from llama_index.indices.vector_store import VectorStoreIndex
from llama_index.vector_stores import PGVectorStore
import textwrap
import openai
import json
import psycopg
from sqlalchemy import make_url
import atexit
import asyncio


# initialize db vars
MIN_CON = 1  # Minimum number of connections you want to keep alive
MAX_CON = 20  # Max number of connections you want to allow
connection_string = "postgresql://postgres:password@localhost:5432"

# open ai api key
openai.api_key = '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'

# connect to db
db_name = "vector_db"

async def getIndex(id):

    # Prepare SQL queries
    select_vector_table_and_name = """
        SELECT vector_table, name 
        FROM companies 
        WHERE id = %s
    """
    select_articles = """
        SELECT text 
        FROM company_datas_raw 
        WHERE id = %s AND type = 'site'
    """

    conn = await psycopg.AsyncConnection.connect(conninfo = "postgresql://postgres:password@localhost:5432/vector_db")

    


    try:
        async with conn:
            async with conn.cursor() as cur:

                await cur.execute("SELECT 1")
                print("this works", await cur.fetchone())
                
                # Fetch vector_table and company name in a single query
                await cur.execute(select_vector_table_and_name, (id,))
                tableName, companyName = await cur.fetchone()

                if not tableName:
                    print("creating a vector table")
                    # create one and persist the table name in the companies table

                    # create a documents array from raw text
                    
                    await cur.execute(select_articles, (id,))
                    articles = [article[0] for article in await cur.fetchall()]

                    # prepare documents array 
                    documents = [Document(text=t) for t in articles]

                    # create vector store
                    url = make_url(connection_string)
                    print (url)
                    vector_store = PGVectorStore.from_params(
                        database=db_name,
                        host=url.host,
                        password=url.password,
                        port=url.port,
                        user=url.username,
                        table_name=f"{companyName}_index",
                    )

                    # persist vector store index to postgres
                    storage_context = StorageContext.from_defaults(vector_store=vector_store)
                    index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

                    # add vector table name to companies table
                    await cur.execute("UPDATE companies SET vector_table = %s WHERE id = %s", (f"{companyName}_index", id))

                    return index

                else:
                    print("vector table already exists")
                    
            # retrieve and rehydrate index
                url = make_url(connection_string)
                print (url)

                vector_store = PGVectorStore.from_params(
                    database=db_name,  
                    host=url.host,   
                    password=url.password,  
                    port=url.port,   
                    user=url.username,   
                    table_name=f"{companyName}_index",
                )

                index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
                return index
    
    except Exception as e:
        print(e)

    finally:
        await conn.close()

    




async def generateAnalysis(id):
    # get an index to query
    index = await getIndex(id)


    # setup sql cursor
    conn = await psycopg.AsyncConnection.connect(conninfo = "postgresql://postgres:password@localhost:5432/vector_db")
     

    try:
        async with conn:
            async with conn.cursor() as cur:

                await cur.execute("SELECT 1")
                print("this also works", await cur.fetchone())

                # get company name
                await cur.execute("SELECT name FROM companies WHERE id = %s", (id,))
                result = await cur.fetchone()
                companyName = result[0]


                # do feature summation and persist response in the company_comparison_points table
                query_engine = index.as_query_engine()
                features = query_engine.query(f"What are the main features of {companyName}? What are the main use cases and benefits of each? What problems does each solve? Reply in json eg [{{'feature': feature, 'usecase': usecase, 'benefit': benefit, 'problem': problem}}].")
                
                await cur.execute(
                "INSERT INTO company_comparison_points (company_id, key, value, \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                (id, "features", features.response)
                )


                # do SWOT analysis and persist response in the company_comparison_points table
                swot = query_engine.query(f"What are the main strengths, weaknesses, opportunities, and threats of {companyName}? Reply in json eg [{{'strength': strength, 'weakness': weakness, 'opportunity': opportunity, 'threat': threat}}].")
                
                await cur.execute(
                    "INSERT INTO company_comparison_points (company_id, key, value, \"createdAt\", \"updatedAt\") VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", 
                    (id, "swot", swot.response)
                )

                await conn.commit()

    except Exception as e:
        # Handle or log the error as appropriate
        print(e)
        await conn.rollback()

    finally:
        await conn.close()

    return True


app = Flask(__name__)

@app.route('/', methods=['GET'])
def do_nothing():
    return jsonify({"message": "Did nothing!"}), 200


@app.route('/api/comparisons', methods=['POST'])
async def compare():
    # this is where we will use LlamaIndex to generate feature lists, SWOTs, etc

    # api will receive a list of company IDs
    data = request.json
    companyIds = data['companyIds']

    for id in companyIds:
        await generateAnalysis(id)

    # then, respond with success
    return jsonify({"message": "Success!"}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found"}), 404


# with app.app_context():
#     global db_pool
#     db_pool = ThreadedConnectionPool(MIN_CON, MAX_CON, connection_string)
#     for conn in db_pool._pool:
#         conn.autocommit = True

# @atexit.register
# def close_pool():
#     db_pool.closeall()



if __name__ == '__main__':
    app.run(debug=True, port=8080)




# old example code


# # create vector store
# url = make_url(connection_string)
# vector_store = PGVectorStore.from_params(
#     database=db_name,
#     host=url.host,
#     password=url.password,
#     port=url.port,
#     user=url.username,
#     # this needs to be modified to be dynamic based on company name
#     table_name="zendesk_index",
# )

# # persist vector store index to postgres
# storage_context = StorageContext.from_defaults(vector_store=vector_store)
# index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

# # ! placeholder - at this point we should note in the companies table that we have created a vector index for this company so we know to not do it again later

# # ~~~ this section is for retrieving / rehydrating? a vector store index from postgres
# # retrieving vector store index
# vector_store = PGVectorStore.from_params(
#     database="vector_db",
#     host="localhost",
#     password="password",
#     port=5432,
#     user="postgres",
#     # this needs to be modified to be dynamic based on company name
#     table_name="zendesk_index",
# )

# index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
# query_engine = index.as_query_engine()

# response = query_engine.query("What are the main features of Zendesk? What are the main use cases and benefits of each? What problems does each solve? Reply in json eg [{'feature': feature, 'usecase': usecase, 'benefit': benefit, 'problem': problem}].")

# # print(textwrap.fill(str(response), 100))



# # ~~~ this section is for creating a vector store and persisting it to postgres ~~~
 
# # create a documents array from raw text
# with open ('./zendeskSitePages.json') as f:
#     articles = json.load(f)
#     texts = [article['text'] for article in articles]


# # prepare documents array 
# documents = [Document(text=t) for t in texts]


# # # ~ this part only needs to be done once
# with conn.cursor() as c:
#     c.execute(f"CREATE DATABASE {db_name}")