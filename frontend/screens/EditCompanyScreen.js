import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

export default function EditCompanyScreen({ route, navigation }) {
  const { company, refreshCompanies } = route.params;

  const [name, setName] = useState(company.name);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${company._id}`, {
        method: 'PUT', // Metodo PUT per aggiornare la compagnia
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, details }),
      });

      if (!response.ok) {
        throw new Error('Failed to update company');
      }

      // Dopo l'aggiornamento, naviga indietro alla lista delle compagnie
      refreshCompanies();
      navigation.goBack();

    } catch (error) {
      console.error('Error updating company:', error);
      alert('Failed to update company');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Company</Text>

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

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
});
