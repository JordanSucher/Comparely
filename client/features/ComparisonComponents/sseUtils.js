// sseUtils.js
import { useDispatch } from "react-redux";
import { toggleTypingEffect } from "./comparisonSlice";

export function initializeSSE(comparisonId) {
  const evtSource = new EventSource(`/api/comparisons/${comparisonId}/progress`);

  const onDataReceived = () => {
    dispatch(toggleTypingEffect());
  };

  const onError = () => {
    console.error("Error in SSE connection")
  }

  evtSource.onmessage = function (event) {
    const sseData = JSON.parse(event.data);
    console.log(sseData);
    if (sseData.progress) {
      onDataReceived();
    }
  };

  evtSource.onerror = function (err) {
    console.error("EventSource failed:", err);
    evtSource.close();
    onError();
  };
}
