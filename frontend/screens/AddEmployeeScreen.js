import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);

  // Fetch companies from the backend
  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:5000/companies');  // Endpoint per ottenere la lista delle company
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addEmployee = async () => {
    const response = await fetch('http://localhost:5000/employees', {  // Assicurati che il server backend sia in esecuzione su questa porta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        role,
        workingHours,
        company,  // Associa il dipendente alla company selezionata
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      navigation.navigate('Employees');  // Naviga verso la lista dei dipendenti
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Employee</Text>

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
          <Picker.Item key={comp.id} label={comp.name} value={comp._id} />
        ))}
      </Picker>

      <Button title="Add Employee" onPress={addEmployee} disabled={!company} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 15,
  },
});