package httpresponder

// this just makes it easier to send responses without having to worry about the encoding
// :)

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Error string `json:"error"`
	Code  int    `json:"code,omitempty"`
}

func SendNormalResponse(httpWriter http.ResponseWriter, httpRequest *http.Request, payload interface{}) {
	httpWriter.Header().Set("Content-Type", "application/json")
	httpWriter.WriteHeader(http.StatusOK)
	json.NewEncoder(httpWriter).Encode(payload)
}
func SendErrorResponse(httpWriter http.ResponseWriter, httpRequest *http.Request, message string, code int) {
	httpWriter.Header().Set("Content-Type", "application/json")
	httpWriter.WriteHeader(code)
	errorJSON, _ := json.Marshal(ErrorResponse{Error: message, Code: code})
	httpWriter.Write(errorJSON)
}
