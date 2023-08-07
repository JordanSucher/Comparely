from flask import Flask, jsonify, request
from llama_index import SimpleDirectoryReader, StorageContext, Document, load_index_from_storage
from llama_index.indices.vector_store import VectorStoreIndex
from llama_index.vector_stores import PGVectorStore
import textwrap
import openai
import json
import psycopg2
from sqlalchemy import make_url


openai.api_key = ''



# # ~~~ this section is for creating a vector store and persisting it to postgres ~~~
 
# # create a documents array from raw text
# with open ('./zendeskSitePages.json') as f:
#     articles = json.load(f)
#     texts = [article['text'] for article in articles]


# # prepare documents array 
# documents = [Document(text=t) for t in texts]


# connect to db
connection_string = "postgresql://postgres:password@localhost:5432"
db_name = "vector_db"
conn = psycopg2.connect(connection_string)
conn.autocommit = True


# # ~ this part only needs to be done once, since it drops the db which we dont want
# # with conn.cursor() as c:
# #     c.execute(f"DROP DATABASE IF EXISTS {db_name}")
# #     c.execute(f"CREATE DATABASE {db_name}")

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


def getIndex(id):
    # check if company already has a vector index table
    cur = conn.cursor()
    cur.execute(f"SELECT vector_table FROM companies WHERE id = {id}")
    tableName = cur.fetchone()
    if tableName is None:
        # create one and persist the table name in the companies table
        index = "" 
    else:
        # retrieve and rehydrate index
        index = ""

    # return the index
    return index




def generateAnalysis(id):
    # get an index to query
    index = getIndex(id)
    
    # do feature summation and SWOT analysis and persist response in the company_comparison_points table





app = Flask(__name__)

@app.route('/', methods=['GET'])
def do_nothing():
    return jsonify({"message": "Did nothing!"}), 200


@app.route('/api/comparison', methods=['POST'])
def compare():
    # this is where we will use LlamaIndex to generate feature lists, SWOTs, etc

    # api will receive a list of company IDs
    data = request.json
    companyIds = data['companyIds']

    for id in companyIds:
        generateAnalysis(id)

    # then, respond with success
    data = request.json
    return jsonify({"message": "Compare!"}), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found"}), 404


# if __name__ == '__main__':
#     app.run(debug=True, port=8080)

