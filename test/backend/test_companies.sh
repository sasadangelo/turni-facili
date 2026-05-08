HOSTNAME="localhost"
PORT="5001"
API_BASE_URL="http://$HOSTNAME:$PORT"
API_COMPANY_URL="$API_BASE_URL/companies"

echo "Create the Company: TechCorp"
RESPONSE=$(curl -s -X POST "$API_COMPANY_URL" -H "Content-Type: application/json" -d "{\"name\": \"TechCorp\"}")

SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: Company creation failed - Response: $RESPONSE"
  exit 1
fi

COMPANY_ID=$(echo "$RESPONSE" | jq -r '.company._id')
if [ "$COMPANY_ID" == "null" ]; then
  echo "❌ ERROR: No company ID returned - Response: $RESPONSE"
  exit 1
fi

echo "✅ Company successfully created with ID: $COMPANY_ID"


echo "Attempting to create duplicate company 'TechCorp'..."
RESPONSE=$(curl -s -X POST "$API_COMPANY_URL" -H "Content-Type: application/json" -d "{\"name\": \"TechCorp\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
MESSAGE=$(echo "$RESPONSE" | jq -r '.message')

if [ "$SUCCESS" == "false" ] && [ "$MESSAGE" == "CompanyAlreadyExists" ]; then
  echo "✅ Duplicate company creation correctly prevented: $MESSAGE"
else
  echo "❌ ERROR: Expected 'CompanyAlreadyExists', but got: '$MESSAGE'"
  exit 1
fi

echo "Get the Company TechCorp:"
RESPONSE=$(curl -s -X GET "$API_COMPANY_URL/$COMPANY_ID")
COMPANY_NAME=$(echo "$RESPONSE" | jq -r '.name')
if [ "$COMPANY_NAME" == "TechCorp" ]; then
    echo "✅ Company TechCorp successfully retrieved."
else
    echo "❌ Failed to retrieve Company TechCorp. Response: $RESPONSE"
    exit 1
fi

echo "Listing all companies:"
RESPONSE=$(curl -s $API_COMPANY_URL)
COMPANY_COUNT=$(echo "$RESPONSE" | jq 'length')
if [ "$COMPANY_COUNT" -eq 1 ]; then
    echo "✅ Exactly one company found."
else
    echo "❌ Expected 1 company, but found $COMPANY_COUNT. Response: $RESPONSE"
    exit 1
fi

echo "Update the Company TechCorp:"
RESPONSE=$(curl -s -X PUT "$API_COMPANY_URL/$COMPANY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NewTechCorp"
  }')
SUCCESS=$(echo "$RESPONSE" | jq '.success')
UPDATED_NAME=$(echo "$RESPONSE" | jq -r '.company.name')
if [ "$SUCCESS" = "true" ] && [ "$UPDATED_NAME" = "NewTechCorp" ]; then
    echo "✅ Company successfully updated with name: $UPDATED_NAME"
else
    echo "❌ Update failed. Response: $RESPONSE"
    exit 1
fi

echo "Delete the Company TechCorp:"
response=$(curl -s -X DELETE $API_COMPANY_URL/$COMPANY_ID)
success=$(echo "$response" | jq -r '.success')
if [ "$success" == "true" ]; then
  echo "✅ Company successfully deleted."
else
  echo "❌ Error deleting company: $(echo "$response" | jq -r '.message')"
fi

echo "Listing all companies:"
RESPONSE=$(curl -s $API_COMPANY_URL)
COMPANY_COUNT=$(echo "$RESPONSE" | jq 'length')
if [ "$COMPANY_COUNT" -eq 0 ]; then
    echo "✅ Exactly 0 companies found."
else
    echo "❌ Expected 0 company, but found $COMPANY_COUNT. Response: $RESPONSE"
    exit 1
fi
