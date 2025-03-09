import React, { useState, useEffect } from 'react';
import { FlatList, Text, Button, View, StyleSheet, ActivityIndicator } from 'react-native';

export default function CompaniesListScreen({ navigation }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchCompanies();
  }, []);

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  employeeCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    width: '100%',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeeRole: {
    fontSize: 16,
    color: '#666',
  },
  employeeHours: {
    fontSize: 14,
    color: '#999',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});
