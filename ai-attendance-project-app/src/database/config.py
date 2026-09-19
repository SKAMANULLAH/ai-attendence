import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

# Fallback to Streamlit secrets if running inside Streamlit
if not supabase_url or not supabase_key:
    try:
        import streamlit as st
        supabase_url = st.secrets.get("SUPABASE_URL")
        supabase_key = st.secrets.get("SUPABASE_KEY")
    except Exception:
        pass

if not supabase_url or not supabase_key:
    # Use user provided defaults if not yet in env
    supabase_url = "https://msmotabdrscqfsmjqdaq.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbW90YWJkcnNjcWZzbWpxZGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTc5OTIzNywiZXhwIjoyMTA1Mzc1MjM3fQ.rGWdHJDFBKGv5uQbWeokpEztl2KBEYSEC9p270bdyxg"

supabase: Client = create_client(supabase_url, supabase_key)