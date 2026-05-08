#!/bin/bash

HOSTNAME="localhost"
PORT="5001"
API_BASE_URL="http://$HOSTNAME:$PORT"
API_COMPANY_URL="$API_BASE_URL/companies"
API_EMPLOYEE_URL="$API_BASE_URL/employees"
API_EVENTTYPE_URL="$API_BASE_URL/eventtypes"
API_EVENT_URL="$API_BASE_URL/events"

# Create the Company: TechCorp
echo "Creating Company: TechCorp"
RESPONSE=$(curl -s -X POST $API_COMPANY_URL -H "Content-Type: application/json" -d "{\"name\": \"TechCorp\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: Company creation failed - Response: $RESPONSE"
  exit 1
fi
COMPANY_ID=$(echo "$RESPONSE" | jq -r '.company._id')
echo "✅ Company successfully created with ID: $COMPANY_ID"

# Create an Employee
echo "Creating Employee: Mario Rossi"
RESPONSE=$(curl -s -X POST $API_EMPLOYEE_URL -H "Content-Type: application/json" -d "{\"name\": \"Mario Rossi\", \"workingHours\": \"40\", \"role\": \"Manager\", \"company\": \"$COMPANY_ID\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: Employee creation failed - Response: $RESPONSE"
  exit 1
fi
EMPLOYEE_ID=$(echo "$RESPONSE" | jq -r '.employee._id')
echo "✅ Employee successfully created with ID: $EMPLOYEE_ID"

# Create an EventType
echo "Creating EventType: Lavoro"
RESPONSE=$(curl -s -X POST "$API_EVENTTYPE_URL" -H "Content-Type: application/json" -d "{\"name\": \"Lavoro\", \"code\": \"WORK\", \"company\": \"$COMPANY_ID\"}")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ ERROR: EventType creation failed - Response: $RESPONSE"
  exit 1
fi
EVENT_TYPE_ID=$(echo "$RESPONSE" | jq -r '.eventType._id')
echo "✅ EventType successfully created with ID: $EVENT_TYPE_ID"

# Create a new Event
echo "Creating new Event..."
START_DATE=$(date -u -v+1d +"%Y-%m-%dT09:00:00.000Z")
END_DATE=$(date -u -v+1d +"%Y-%m-%dT17:00:00.000Z")

RESPONSE=$(curl -s -X POST "$API_EVENT_URL" -H "Content-Type: application/json" -d "{
  \"title\": \"Team Meeting\",
  \"summary\": \"Weekly team sync\",
  \"dtStart\": \"$START_DATE\",
  \"dtEnd\": \"$END_DATE\",
  \"allDay\": false,
  \"typeFk\": \"$EVENT_TYPE_ID\",
  \"companyFk\": \"$COMPANY_ID\",
  \"employeeFk\": \"$EMPLOYEE_ID\",
  \"status\": \"confirmed\"
}")

EVENT_ID=$(echo "$RESPONSE" | jq -r '._id')
if [ "$EVENT_ID" == "null" ] || [ -z "$EVENT_ID" ]; then
  echo "❌ ERROR: Event creation failed - Response: $RESPONSE"
  exit 1
fi
echo "✅ Event successfully created with ID: $EVENT_ID"

# Get single Event
echo "Fetching Event with ID: $EVENT_ID"
RESPONSE=$(curl -s "$API_EVENT_URL/$EVENT_ID")
EVENT_TITLE=$(echo "$RESPONSE" | jq -r '.title')
if [ "$EVENT_TITLE" == "Team Meeting" ]; then
  echo "✅ Event successfully retrieved with title: $EVENT_TITLE"
else
  echo "❌ ERROR: Failed to retrieve Event - Response: $RESPONSE"
  exit 1
fi

# Get all Events
echo "Fetching all Events..."
RESPONSE=$(curl -s "$API_EVENT_URL")
COUNT=$(echo "$RESPONSE" | jq 'length')
if [ "$COUNT" -ge 1 ]; then
  echo "✅ Found $COUNT Event(s)"
else
  echo "❌ ERROR: Expected at least 1 Event, but found $COUNT - Response: $RESPONSE"
  exit 1
fi

# Update the Event
echo "Updating Event..."
RESPONSE=$(curl -s -X PUT "$API_EVENT_URL/$EVENT_ID" -H "Content-Type: application/json" -d "{
  \"title\": \"Updated Team Meeting\",
  \"summary\": \"Monthly team sync\",
  \"status\": \"tentative\"
}")

UPDATED_TITLE=$(echo "$RESPONSE" | jq -r '.title')
UPDATED_SUMMARY=$(echo "$RESPONSE" | jq -r '.summary')
if [ "$UPDATED_TITLE" == "Updated Team Meeting" ] && [ "$UPDATED_SUMMARY" == "Monthly team sync" ]; then
  echo "✅ Event successfully updated with title: $UPDATED_TITLE"
else
  echo "❌ ERROR: Update failed - Response: $RESPONSE"
  exit 1
fi

# Create a recurring Event
echo "Creating recurring Event..."
RECUR_START_DATE=$(date -u -v+2d +"%Y-%m-%dT10:00:00.000Z")
RECUR_END_DATE=$(date -u -v+2d +"%Y-%m-%dT11:00:00.000Z")

RESPONSE=$(curl -s -X POST "$API_EVENT_URL" -H "Content-Type: application/json" -d "{
  \"title\": \"Daily Standup\",
  \"summary\": \"Daily team standup\",
  \"dtStart\": \"$RECUR_START_DATE\",
  \"dtEnd\": \"$RECUR_END_DATE\",
  \"recurring\": true,
  \"frequency\": 3,
  \"interval\": 1,
  \"byweekday\": [0, 1, 2, 3, 4],
  \"untilType\": 2,
  \"untilOccurrences\": 10,
  \"typeFk\": \"$EVENT_TYPE_ID\",
  \"companyFk\": \"$COMPANY_ID\",
  \"employeeFk\": \"$EMPLOYEE_ID\"
}")

RECURRING_EVENT_ID=$(echo "$RESPONSE" | jq -r '._id')
if [ "$RECURRING_EVENT_ID" == "null" ] || [ -z "$RECURRING_EVENT_ID" ]; then
  echo "❌ ERROR: Recurring Event creation failed - Response: $RESPONSE"
  exit 1
fi
echo "✅ Recurring Event successfully created with ID: $RECURRING_EVENT_ID"

# Verify recurring event properties
echo "Verifying recurring Event properties..."
RESPONSE=$(curl -s "$API_EVENT_URL/$RECURRING_EVENT_ID")
IS_RECURRING=$(echo "$RESPONSE" | jq -r '.recurring')
FREQUENCY=$(echo "$RESPONSE" | jq -r '.frequency')
if [ "$IS_RECURRING" == "true" ] && [ "$FREQUENCY" == "3" ]; then
  echo "✅ Recurring Event properties verified"
else
  echo "❌ ERROR: Recurring Event properties incorrect - Response: $RESPONSE"
  exit 1
fi

# Delete the recurring Event
echo "Deleting recurring Event with ID: $RECURRING_EVENT_ID"
RESPONSE=$(curl -s -X DELETE "$API_EVENT_URL/$RECURRING_EVENT_ID")
MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
if [ "$MESSAGE" == "Evento eliminato" ]; then
  echo "✅ Recurring Event successfully deleted"
else
  echo "❌ ERROR: Delete failed - Response: $RESPONSE"
  exit 1
fi

# Delete the first Event
echo "Deleting Event with ID: $EVENT_ID"
RESPONSE=$(curl -s -X DELETE "$API_EVENT_URL/$EVENT_ID")
MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
if [ "$MESSAGE" == "Evento eliminato" ]; then
  echo "✅ Event successfully deleted"
else
  echo "❌ ERROR: Delete failed - Response: $RESPONSE"
  exit 1
fi

# Verify deletion
echo "Fetching all Events after deletion..."
RESPONSE=$(curl -s "$API_EVENT_URL")
COUNT=$(echo "$RESPONSE" | jq 'length')
if [ "$COUNT" -eq 0 ]; then
  echo "✅ Exactly 0 Events found after deletion"
else
  echo "❌ ERROR: Expected 0 Events, but found $COUNT - Response: $RESPONSE"
  exit 1
fi

# Cleanup: Delete EventType
echo "Deleting EventType with ID: $EVENT_TYPE_ID"
RESPONSE=$(curl -s -X DELETE "$API_EVENTTYPE_URL/$EVENT_TYPE_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ EventType successfully deleted"
else
  echo "❌ ERROR: EventType deletion failed - Response: $RESPONSE"
  exit 1
fi

# Cleanup: Delete Employee
echo "Deleting Employee with ID: $EMPLOYEE_ID"
RESPONSE=$(curl -s -X DELETE "$API_EMPLOYEE_URL/$EMPLOYEE_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ Employee successfully deleted"
else
  echo "❌ ERROR: Employee deletion failed - Response: $RESPONSE"
  exit 1
fi

# Cleanup: Delete Company
echo "Deleting Company with ID: $COMPANY_ID"
RESPONSE=$(curl -s -X DELETE "$API_COMPANY_URL/$COMPANY_ID")
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✅ Company successfully deleted"
else
  echo "❌ ERROR: Company deletion failed - Response: $RESPONSE"
  exit 1
fi

echo ""
echo "=========================================="
echo "✅ ALL EVENT TESTS PASSED SUCCESSFULLY!"
echo "=========================================="
