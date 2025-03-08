COMPANY_ID=$(curl -s -X POST http://localhost:5000/companies -H "Content-Type: application/json" -d '{"name": "TechCorp"}' | jq -r '._id')
echo "Company successfully created with ID: $COMPANY_ID"

echo "Get the Company TechCorp:"
curl -X GET "http://localhost:5000/companies/$COMPANY_ID"
echo
echo "Company TechCorp successfully retrieved."

EMPLOYEE_1_ID=$(curl -s -X POST http://localhost:5000/employees -H "Content-Type: application/json" -d "{\"name\": \"Mario Rossi\", \"workingHours\": \"30\", \"role\": \"Manager\", \"company\": \"$COMPANY_ID\"}" | jq -r '.employee._id')
echo "Employee Mario Rossi successfully created with ID: $EMPLOYEE_1_ID"

EMPLOYEE_2_ID=$(curl -s -X POST http://localhost:5000/employees -H "Content-Type: application/json" -d "{\"name\": \"Salvatore D'Angelo\", \"workingHours\": \"20\", \"role\": \"Developer\", \"company\": \"$COMPANY_ID\"}" | jq -r '.employee._id')
echo "Employee Salvatore D'Angelo successfully created with ID: $EMPLOYEE_1_ID"

# Lista degli employee associati alla compagnia
echo "Listing all employees for company ID: $COMPANY_ID"
curl -s -X GET http://localhost:5000/employees | jq .
echo

echo "Get the Employee Mario Rossi:"
curl -X GET "http://localhost:5000/employees/$EMPLOYEE_1_ID"
echo
echo "Employee Mario Rossi successfully retrieved."

curl -X PUT "http://localhost:5000/employees/$EMPLOYEE_1_ID" -H "Content-Type: application/json" -d "{
  \"name\": \"Mario Rossi\",
  \"role\": \"Senior Manager\",
  \"workingHours\": \"40\",
  \"company\": \"$COMPANY_ID\"
}"
echo "Employee Mario Rossi successfully updated."

# Lista degli employee associati alla compagnia
echo "Listing all employees for company ID: $COMPANY_ID"
curl -s -X GET http://localhost:5000/employees | jq .
echo

curl -X DELETE "http://localhost:5000/employees/$EMPLOYEE_1_ID"
echo "Employee Mario Rossi successfully deleted."
curl -X DELETE "http://localhost:5000/employees/$EMPLOYEE_2_ID"
echo "Employee Salvatore D'Angelo successfully deleted."

# Lista degli employee associati alla compagnia
echo "Listing all employees for company ID: $COMPANY_ID"
curl -s -X GET http://localhost:5000/employees | jq .
echo

echo "Listing all companies:"
curl -s http://localhost:5000/companies
echo

# Aggiorna la company
curl -X PUT http://localhost:5000/companies/$COMPANY_ID -H "Content-Type: application/json" -d '{
  "name": "NewTechCorp"
}'
echo "Company successfully updated."

# Elimina la company
curl -X DELETE http://localhost:5000/companies/$COMPANY_ID
echo "Company successfully deleted."

echo "Listing all companies:"
curl -s http://localhost:5000/companies
echo
