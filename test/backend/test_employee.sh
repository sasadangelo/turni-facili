HOSTNAME="localhost"
PORT="5001"
API_BASE_URL="http://$HOSTNAME:$PORT"
API_COMPANY_URL="$API_BASE_URL/companies"
API_EMPLOYEE_URL="$API_BASE_URL/employees"

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

echo "Create the Employee: Mario Rossi"
RESPONSE=$(curl -s -X POST $API_EMPLOYEE_URL -H "Content-Type: application/json" -d "{\"name\": \"Mario Rossi\", \"workingHours\": \"30\", \"role\": \"Manager\", \"company\": \"$COMPANY_ID\"}" | jq -r '.employee._id')
echo $RESPONSE
# EMPLOYEE_1_ID=$(curl -s -X POST $API_EMPLOYEE_URL -H "Content-Type: application/json" -d "{\"name\": \"Mario Rossi\", \"workingHours\": \"30\", \"role\": \"Manager\", \"company\": \"$COMPANY_ID\"}" | jq -r '.employee._id')
# echo "Employee Mario Rossi successfully created with ID: $EMPLOYEE_1_ID"

# EMPLOYEE_2_ID=$(curl -s -X POST $API_EMPLOYEE_URL -H "Content-Type: application/json" -d "{\"name\": \"Salvatore D'Angelo\", \"workingHours\": \"20\", \"role\": \"Developer\", \"company\": \"$COMPANY_ID\"}" | jq -r '.employee._id')
# echo "Employee Salvatore D'Angelo successfully created with ID: $EMPLOYEE_1_ID"

# Lista degli employee associati alla compagnia
# echo "Listing all employees for company ID: $COMPANY_ID"
# curl -s -X GET $API_EMPLOYEE_URL | jq .
# echo

# echo "Get the Employee Mario Rossi:"
# curl -X GET "$API_EMPLOYEE_URL/$EMPLOYEE_1_ID"
# echo
# echo "Employee Mario Rossi successfully retrieved."

# curl -X PUT "$API_EMPLOYEE_URL/$EMPLOYEE_1_ID" -H "Content-Type: application/json" -d "{
#   \"name\": \"Mario Rossi\",
#   \"role\": \"Senior Manager\",
#   \"workingHours\": \"40\",
#   \"company\": \"$COMPANY_ID\"
# }"
# echo "Employee Mario Rossi successfully updated."

# Lista degli employee associati alla compagnia
# echo "Listing all employees for company ID: $COMPANY_ID"
# curl -s -X GET $API_EMPLOYEE_URL | jq .
# echo

# curl -X DELETE "$API_EMPLOYEE_URL/$EMPLOYEE_1_ID"
# echo "Employee Mario Rossi successfully deleted."
# curl -X DELETE "$API_EMPLOYEE_URL/$EMPLOYEE_2_ID"
# echo "Employee Salvatore D'Angelo successfully deleted."

# Lista degli employee associati alla compagnia
# echo "Listing all employees for company ID: $COMPANY_ID"
# curl -s -X GET $API_EMPLOYEE_URL | jq .
# echo

# echo "Listing all companies:"
# curl -s $API_COMPANY_URL
# echo

# Aggiorna la company
# curl -X PUT $API_COMPANY_URL/$COMPANY_ID -H "Content-Type: application/json" -d '{
#   "name": "NewTechCorp"
# }'
# echo "Company successfully updated."

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
