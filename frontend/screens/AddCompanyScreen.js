import React, { useState } from 'react';
import { Text, TextInput, Button, View, StyleSheet } from 'react-native';

export default function AddCompanyScreen({ navigation }) {
  const [name, setName] = useState('');

  const addCompany = async () => {
    const response = await fetch('http://localhost:5000/companies', {  // Assicurati che il server backend sia in esecuzione su questa porta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      navigation.navigate('Companies');  // Naviga verso la lista dei dipendenti
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Company</Text>

      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={name}
        onChangeText={setName}
      />

      <Button title="Add Company" onPress={addCompany} />
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
