import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from supabase import create_client, Client

load_dotenv()

# App Configuration
PORT = int(os.getenv("PORT", "8000"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DOMAIN = os.getenv("DOMAIN", "snap-ai.online")

# Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://msmotabdrscqfsmjqdaq.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbW90YWJkcnNjcWZzbWpxZGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTc5OTIzNywiZXhwIjoyMTA1Mzc1MjM3fQ.rGWdHJDFBKGv5uQbWeokpEztl2KBEYSEC9p270bdyxg")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "zggy3oaf")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "533365522235362")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "fJDY9TReJ7vz45ijOdjIZkBshXk")

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image_to_cloudinary(file_bytes, folder="snap_ai/attendance"):
    """Helper to upload raw image bytes to Cloudinary and return the secure URL"""
    try:
        response = cloudinary.uploader.upload(
            file_bytes,
            folder=folder,
            resource_type="image"
        )
        return response.get("secure_url")
    except Exception as e:
        print(f"[Cloudinary Warning] Upload failed: {e}")
        return None

# Allowed CORS Origins
raw_cors = os.getenv("CORS_ORIGINS", "*")
ALLOWED_ORIGINS = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]
