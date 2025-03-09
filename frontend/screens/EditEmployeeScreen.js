import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function EditEmployeeScreen({ route, navigation }) {
  const { employee, refreshEmployees } = route.params;

  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);
  const [workingHours, setWorkingHours] = useState(employee.workingHours.toString());
  const [company, setCompany] = useState(employee.company);
  const [companies, setCompanies] = useState([]);

  // Carica le aziende dall'API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/companies');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Aggiorna `company` quando `companies` è stato caricato
  useEffect(() => {
    if (companies.length > 0) {
      console.log("Employee company:", employee.company);
      console.log("Companies available:", companies);

      // Controlla se l'azienda dell'impiegato è nella lista
      const foundCompany = companies.find((c) => c._id === employee.company);
      if (foundCompany) {
        setCompany(foundCompany._id);
      } else {
        setCompany(""); // Nessuna azienda corrispondente trovata
      }
    }
  }, [companies]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/employees/${employee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, workingHours: Number(workingHours), company }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      refreshEmployees();
      navigation.goBack();

    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Employee</Text>

      <TextInput
        style={styles.input}
        placeholder="Employee Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      />
      <TextInput
        style={styles.input}
        placeholder="Working Hours"
        value={workingHours}
        keyboardType="numeric"
        onChangeText={setWorkingHours}
      />

      <Text style={styles.label}>Select Company:</Text>
      <Picker
        selectedValue={company}
        style={styles.picker}
        onValueChange={(itemValue) => setCompany(itemValue)}
      >
        <Picker.Item label="Select a company" value="" />
        {companies.map((comp) => (
          <Picker.Item key={comp._id} label={comp.name} value={comp._id} />
        ))}
      </Picker>

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});
