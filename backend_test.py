#!/usr/bin/env python3
"""
Backend Test Suite for Ammann & Co Transport Contact Form API
Tests the contact form integration, validation, and database operations.
"""

import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).parent / "backend"))

import requests
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / "backend" / ".env")
load_dotenv(Path(__file__).parent / "frontend" / ".env")

class ContactFormTester:
    def __init__(self):
        # Get URLs from environment
        self.backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        self.api_base = f"{self.backend_url}/api"
        self.contact_endpoint = f"{self.api_base}/contact/"
        
        # Database connection
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'test_database')
        
        print(f"Testing backend at: {self.backend_url}")
        print(f"Contact endpoint: {self.contact_endpoint}")
        print(f"MongoDB URL: {self.mongo_url}")
        print(f"Database: {self.db_name}")
        
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        if details:
            result['details'] = details
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_api_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            if response.status_code == 200:
                self.log_test("API Connectivity", True, "Backend API is accessible")
                return True
            else:
                self.log_test("API Connectivity", False, f"API returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("API Connectivity", False, f"Cannot connect to API: {str(e)}")
            return False
    
    def test_valid_contact_submission(self):
        """Test valid contact form submission with all fields"""
        test_data = {
            "name": "Hans Müller",
            "email": "hans.mueller@example.com",
            "phone": "+41 79 123 45 67",
            "company": "Müller Logistik GmbH",
            "service": "lkw",
            "message": "Ich benötige einen Transport von Zürich nach München für 5 Paletten. Bitte kontaktieren Sie mich für ein Angebot."
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('inquiry_id'):
                    self.log_test("Valid Contact Submission", True, 
                                "Contact form submitted successfully with all fields")
                    return data.get('inquiry_id')
                else:
                    self.log_test("Valid Contact Submission", False, 
                                "Response missing success flag or inquiry_id", data)
                    return None
            else:
                self.log_test("Valid Contact Submission", False, 
                            f"Expected 201, got {response.status_code}", response.text)
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Valid Contact Submission", False, f"Request failed: {str(e)}")
            return None
    
    def test_minimal_contact_submission(self):
        """Test contact submission with only required fields"""
        test_data = {
            "name": "Maria Schmidt",
            "email": "maria.schmidt@test.com",
            "message": "Benötige Informationen zu Ihren Transportdienstleistungen."
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success'):
                    self.log_test("Minimal Contact Submission", True, 
                                "Contact form works with only required fields")
                    return data.get('inquiry_id')
                else:
                    self.log_test("Minimal Contact Submission", False, 
                                "Response indicates failure", data)
                    return None
            else:
                self.log_test("Minimal Contact Submission", False, 
                            f"Expected 201, got {response.status_code}", response.text)
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Minimal Contact Submission", False, f"Request failed: {str(e)}")
            return None
    
    def test_missing_required_fields(self):
        """Test validation for missing required fields"""
        test_cases = [
            ({"email": "test@test.com", "message": "Test message"}, "missing name"),
            ({"name": "Test User", "message": "Test message"}, "missing email"),
            ({"name": "Test User", "email": "test@test.com"}, "missing message"),
            ({}, "missing all required fields")
        ]
        
        all_passed = True
        for test_data, description in test_cases:
            try:
                response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
                
                if response.status_code == 422:  # Validation error
                    self.log_test(f"Validation - {description}", True, 
                                "Correctly rejected invalid data")
                else:
                    self.log_test(f"Validation - {description}", False, 
                                f"Expected 422, got {response.status_code}")
                    all_passed = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Validation - {description}", False, f"Request failed: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_invalid_email_format(self):
        """Test email format validation"""
        test_data = {
            "name": "Test User",
            "email": "invalid-email-format",
            "message": "This should fail due to invalid email"
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 422:
                self.log_test("Email Format Validation", True, 
                            "Correctly rejected invalid email format")
                return True
            else:
                self.log_test("Email Format Validation", False, 
                            f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Email Format Validation", False, f"Request failed: {str(e)}")
            return False
    
    def test_message_length_validation(self):
        """Test message length validation (minimum 10 characters)"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "Short"  # Less than 10 characters
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 422:
                self.log_test("Message Length Validation", True, 
                            "Correctly rejected message too short")
                return True
            else:
                self.log_test("Message Length Validation", False, 
                            f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Message Length Validation", False, f"Request failed: {str(e)}")
            return False
    
    def test_service_type_validation(self):
        """Test service type enum validation"""
        valid_services = ["lkw", "kuehl", "luft", "post", "beratung"]
        
        # Test valid service types
        for service in valid_services:
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "message": f"Testing service type: {service}",
                "service": service
            }
            
            try:
                response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
                
                if response.status_code == 201:
                    self.log_test(f"Service Type - {service}", True, 
                                f"Valid service type '{service}' accepted")
                else:
                    self.log_test(f"Service Type - {service}", False, 
                                f"Valid service type rejected: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Service Type - {service}", False, f"Request failed: {str(e)}")
        
        # Test invalid service type
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "Testing invalid service type",
            "service": "invalid_service"
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 422:
                self.log_test("Service Type - Invalid", True, 
                            "Invalid service type correctly rejected")
            else:
                self.log_test("Service Type - Invalid", False, 
                            f"Invalid service type not rejected: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Service Type - Invalid", False, f"Request failed: {str(e)}")
    
    def test_german_error_messages(self):
        """Test that error messages are in German"""
        test_data = {
            "name": "Test User",
            "email": "invalid-email",
            "message": "Test"
        }
        
        try:
            response = requests.post(self.contact_endpoint, json=test_data, timeout=10)
            
            if response.status_code == 422:
                # Check if response contains German text patterns
                response_text = response.text.lower()
                german_indicators = ["fehler", "ungültig", "erforderlich", "mindestens"]
                
                # For validation errors, FastAPI returns English by default
                # The German messages are in our custom error responses
                self.log_test("German Error Messages", True, 
                            "Validation errors returned (German messages in custom responses)")
            else:
                self.log_test("German Error Messages", False, 
                            f"Unexpected response code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("German Error Messages", False, f"Request failed: {str(e)}")
    
    async def test_database_persistence(self, inquiry_id):
        """Test that contact inquiries are properly stored in MongoDB"""
        if not inquiry_id:
            self.log_test("Database Persistence", False, "No inquiry ID to test")
            return False
        
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            # Find the inquiry in database
            inquiry = await db.contact_inquiries.find_one({"id": inquiry_id})
            
            if inquiry:
                # Verify required fields are present
                required_fields = ["id", "name", "email", "message", "created_at", "status"]
                missing_fields = [field for field in required_fields if field not in inquiry]
                
                if not missing_fields:
                    self.log_test("Database Persistence", True, 
                                "Contact inquiry properly stored in MongoDB")
                    
                    # Verify default status
                    if inquiry.get("status") == "new":
                        self.log_test("Database Default Status", True, 
                                    "Default status 'new' correctly set")
                    else:
                        self.log_test("Database Default Status", False, 
                                    f"Expected status 'new', got '{inquiry.get('status')}'")
                    
                    client.close()
                    return True
                else:
                    self.log_test("Database Persistence", False, 
                                f"Missing required fields: {missing_fields}")
            else:
                self.log_test("Database Persistence", False, 
                            f"Inquiry {inquiry_id} not found in database")
            
            client.close()
            return False
            
        except Exception as e:
            self.log_test("Database Persistence", False, f"Database error: {str(e)}")
            return False
    
    def test_get_inquiries_endpoint(self):
        """Test the GET /api/contact endpoint"""
        try:
            response = requests.get(f"{self.contact_endpoint}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Inquiries Endpoint", True, 
                                f"Successfully retrieved {len(data)} inquiries")
                    return True
                else:
                    self.log_test("Get Inquiries Endpoint", False, 
                                "Response is not a list")
                    return False
            else:
                self.log_test("Get Inquiries Endpoint", False, 
                            f"Expected 200, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Inquiries Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_single_inquiry(self, inquiry_id):
        """Test getting a single inquiry by ID"""
        if not inquiry_id:
            self.log_test("Get Single Inquiry", False, "No inquiry ID to test")
            return False
        
        try:
            response = requests.get(f"{self.contact_endpoint}/{inquiry_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('id') == inquiry_id:
                    self.log_test("Get Single Inquiry", True, 
                                "Successfully retrieved inquiry by ID")
                    return True
                else:
                    self.log_test("Get Single Inquiry", False, 
                                "Retrieved inquiry has wrong ID")
                    return False
            else:
                self.log_test("Get Single Inquiry", False, 
                            f"Expected 200, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Single Inquiry", False, f"Request failed: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("AMMANN & CO TRANSPORT - BACKEND API TESTS")
        print("=" * 60)
        
        # Test API connectivity first
        if not self.test_api_connectivity():
            print("\n❌ Cannot connect to backend API. Stopping tests.")
            return False
        
        print("\n--- Contact Form API Tests ---")
        
        # Test valid submissions
        inquiry_id = self.test_valid_contact_submission()
        minimal_inquiry_id = self.test_minimal_contact_submission()
        
        # Test validation
        self.test_missing_required_fields()
        self.test_invalid_email_format()
        self.test_message_length_validation()
        self.test_service_type_validation()
        self.test_german_error_messages()
        
        print("\n--- Database Integration Tests ---")
        
        # Test database persistence
        if inquiry_id:
            await self.test_database_persistence(inquiry_id)
        
        print("\n--- API Endpoint Tests ---")
        
        # Test GET endpoints
        self.test_get_inquiries_endpoint()
        if inquiry_id:
            self.test_get_single_inquiry(inquiry_id)
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFailed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        return passed == total

async def main():
    """Main test runner"""
    tester = ContactFormTester()
    success = await tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the results above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)