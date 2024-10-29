import os
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase

# Load environment variables
load_dotenv()

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

def chat_with_llm():
    # Initialize Gemini model and database connection
    model = initialize_gemini()
    chat_session = model.start_chat()
    
    # Connect to MySQL database
    mysql_uri = f'mysql+mysqlconnector://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:3306/{os.getenv("DB_NAME")}'
    db = SQLDatabase.from_uri(mysql_uri)
    
    # Get database schema
    schema = db.get_table_info()
    
    print("Chat started! Type 'quit' to exit.")
    
    while True:
        # Get user input
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'quit':
            break
            
        try:
            # Create context with schema and question to get SQL query
            context = f"""Based on this database schema:
            {schema}
            
            Generate only a SQL query to answer this question: {user_input}
            Return only the SQL query without any markdown formatting or explanations."""
            
            # Get SQL query from model
            response = chat_session.send_message(context)
            sql_query = response.text.strip().replace('```sql', '').replace('```', '')
            
            # Execute SQL query and get results
            results = db.run(sql_query)
            
            # Create context with results for final answer
            results_context = f"""Based on this database query result:
            {results}
            
            Please provide a natural language answer to the question also be user friendly to continue an engaging conversation: {user_input}"""
            
            # Get final response
            final_response = chat_session.send_message(results_context)
            
            print("\nAssistant: ", end="")
            print(final_response.text)
            
        except Exception as e:
            print(f"\nError: {str(e)}")
            break

if __name__ == "__main__":
    chat_with_llm()
