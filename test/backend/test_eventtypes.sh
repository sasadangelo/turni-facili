#!/bin/bash

HOSTNAME="localhost"
PORT="5001"
API_BASE_URL="http://$HOSTNAME:$PORT"
API_COMPANY_URL="$API_BASE_URL/companies"
API_EVENTTYPE_URL="$API_BASE_URL/eventtypes"

echo "Create the Company: TechCorp"
RESPONSE=$(curl -s -X POST $API_COMPANY_URL -H "Content-Type: application/json" -d "{\"name\": \"TechCorp\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: Company creation failed - Response: $RESPONSE"
  exit 1
fi
COMPANY_ID=$(echo "$RESPONSE" | jq -r '.company._id')
echo "Company successfully created with ID: $COMPANY_ID"

# Creazione di un nuovo EventType
echo "Creating new EventType..."
RESPONSE=$(curl -s -X POST "$API_EVENTTYPE_URL" -H "Content-Type: application/json" -d "{\"name\": \"Lavoro\", \"code\": \"WORK\", \"company\": \"$COMPANY_ID\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: EventType creation failed - Response: $RESPONSE"
  exit 1
fi
EVENT_TYPE_ID=$(echo "$RESPONSE" | jq -r '.eventType._id')
echo "✅ EventType successfully created with ID: $EVENT_TYPE_ID"

# Get single EventType
echo "Fetching EventType with ID: $EVENT_TYPE_ID"
RESPONSE=$(curl -s "$API_EVENTTYPE_URL/$EVENT_TYPE_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
EVENT_NAME=$(echo "$RESPONSE" | jq -r '.eventType.name')
if [ "$SUCCESS" == "true" ] && [ "$EVENT_NAME" == "Lavoro" ]; then
  echo "✅ EventType successfully retrieved with name: $EVENT_NAME"
else
  echo "❌ ERROR: Failed to retrieve EventType - Response: $RESPONSE"
  exit 1
fi

# Get all EventTypes for the company
echo "Fetching all EventTypes for company..."
RESPONSE=$(curl -s "$API_EVENTTYPE_URL?company=$COMPANY_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
COUNT=$(echo "$RESPONSE" | jq -r '.count')
if [ "$SUCCESS" == "true" ] && [ "$COUNT" -eq 1 ]; then
  echo "✅ Exactly 1 EventType found for company"
else
  echo "❌ ERROR: Expected 1 EventType, but found $COUNT - Response: $RESPONSE"
  exit 1
fi

# Update the EventType
echo "Updating EventType..."
RESPONSE=$(curl -s -X PUT "$API_EVENTTYPE_URL/$EVENT_TYPE_ID" -H "Content-Type: application/json" -d '{
  "name": "Ferie",
  "code": "VACATION"
}')
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
UPDATED_NAME=$(echo "$RESPONSE" | jq -r '.eventType.name')
if [ "$SUCCESS" == "true" ] && [ "$UPDATED_NAME" == "Ferie" ]; then
  echo "✅ EventType successfully updated with name: $UPDATED_NAME"
else
  echo "❌ ERROR: Update failed - Response: $RESPONSE"
  exit 1
fi

# Delete the EventType
echo "Deleting EventType with ID: $EVENT_TYPE_ID"
RESPONSE=$(curl -s -X DELETE "$API_EVENTTYPE_URL/$EVENT_TYPE_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ EventType successfully deleted"
else
  echo "❌ ERROR: Delete failed - Response: $RESPONSE"
  exit 1
fi

# Verify deletion
echo "Fetching all EventTypes after deletion..."
RESPONSE=$(curl -s "$API_EVENTTYPE_URL?company=$COMPANY_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
COUNT=$(echo "$RESPONSE" | jq -r '.count')
if [ "$SUCCESS" == "true" ] && [ "$COUNT" -eq 0 ]; then
  echo "✅ Exactly 0 EventTypes found after deletion"
else
  echo "❌ ERROR: Expected 0 EventTypes, but found $COUNT - Response: $RESPONSE"
  exit 1
fi

# Delete the company
echo "Deleting company with ID: $COMPANY_ID"
RESPONSE=$(curl -s -X DELETE $API_COMPANY_URL/$COMPANY_ID)
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ Company successfully deleted"
else
  echo "❌ ERROR: Company deletion failed - Response: $RESPONSE"
  exit 1
fi
