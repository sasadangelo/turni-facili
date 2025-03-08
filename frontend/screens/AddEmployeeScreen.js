import React, { useState } from 'react';
import { Text, TextInput, Button, View, StyleSheet } from 'react-native';

export default function AddEmployeeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [workingHours, setWorkingHours] = useState('');

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
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      navigation.navigate('EmployeeList');  // Naviga verso la lista dei dipendenti
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

      <Button title="Add Employee" onPress={addEmployee} />
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
});
