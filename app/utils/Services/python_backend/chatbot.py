import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.utilities import SQLDatabase
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Load environment variables
load_dotenv()

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        print(f"Received message: {request.message}")
        response = chat_with_llm(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def initialize_gemini():
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not set in the environment variables.")
    genai.configure(api_key=gemini_api_key)
    
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.9,
        "top_k": 40,
        "max_output_tokens": 4096,
        "response_mime_type": "text/plain",
    }
    
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )
    return model

def chat_with_llm(user_message: str):
    # Initialize Gemini model and database connection
    model = initialize_gemini()
    chat_session = model.start_chat()
    
    # Connect to MySQL database
    mysql_uri = f'mysql+mysqlconnector://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:3306/{os.getenv("DB_NAME")}'
    db = SQLDatabase.from_uri(mysql_uri)
    
    # Get database schema
    schema = db.get_table_info()
    
    try:
        # Create context with schema and question to get SQL query
        context = f"""Based on this database schema:
        {schema}
        
        Generate only a SQL query to answer this question: {user_message}
        Return only the SQL query without any markdown formatting or explanations."""
        
        # Get SQL query from model
        response = chat_session.send_message(context)
        sql_query = response.text.strip().replace('```sql', '').replace('```', '')
        
        # Execute SQL query and get results
        results = db.run(sql_query)

        print(f"SQL Query: {sql_query}")
        print(f"Results: {results}")
        
        # Create context with results for final answer
        if results:
            results_context = f"""Based on this database query result:
            {results}
            
            You are a friendly customer service chatbot for B Airways. Please provide a natural, conversational response to this question: {user_message}

            Guidelines:
            - Use the query results to provide accurate information
            - Maintain a helpful and professional tone
            - Only share publicly available information
            - Do not reveal any sensitive data like personal details or internal records
            - Keep the conversation engaging and suggest relevant follow-up topics
            - Format numbers and dates in a user-friendly way"""
        else:
            results_context = f"""You are a helpful and friendly customer service chatbot for B Airways. 
            Even though I don't have specific database information for this query, please:
            1. Maintain a natural, conversational tone
            2. Acknowledge the user's question
            3. Provide helpful general information about aviation and travel
            4. Suggest alternative topics or questions if appropriate
            5. Express willingness to help with other questions
            
            The user's question is: {user_message}
            
            Remember to be empathetic, professional and focus only on publicly available information."""
        # Get final response
        final_response = chat_session.send_message(results_context)
        return final_response.text
        
    except Exception as e:
        raise Exception(f"Error in chat processing: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)