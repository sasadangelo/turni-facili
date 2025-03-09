import React, { useState, useEffect } from 'react';
import { FlatList, Text, Button, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Per le icone

export default function CompaniesListScreen({ navigation }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:5000/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
      setLoading(false); // Fine del caricamento
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies'); // Gestione errore
      setLoading(false); // Fine del caricamento anche in caso di errore
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${companyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company details');
      }
      const data = await response.json();

      // Naviga verso lo schermo di modifica passando i dettagli della compagnia
      navigation.navigate('EditCompany', { company: data, refreshCompanies: fetchCompanies });

    } catch (error) {
      console.error('Error fetching company details:', error);
      setError('Failed to fetch company details');
    }
  };

  const handleDelete = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${companyId}`, {
        method: 'DELETE', // Metodo DELETE
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      // Se la richiesta è andata a buon fine, rimuoviamo la compagnia dalla lista
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== companyId)
      );
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('Failed to delete company');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={() => {
          setLoading(true);
          setError(null);
          fetchCompanies();
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Companies</Text>

      <FlatList
        data={companies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleEdit(item._id)} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Add New Company" onPress={() => navigation.navigate('AddCompany')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  companyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    padding: 5,
    /*backgroundColor: '#4CAF50',*/
    /*borderRadius: 5,*/
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});
