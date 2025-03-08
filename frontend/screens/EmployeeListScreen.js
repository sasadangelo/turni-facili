import React, { useState, useEffect } from 'react';
import { FlatList, Text, Button, View, StyleSheet, ActivityIndicator } from 'react-native';

export default function EmployeeListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
        setLoading(false); // Fine del caricamento
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employees'); // Gestione errore
        setLoading(false); // Fine del caricamento anche in caso di errore
      }
    };
    fetchEmployees();
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
          fetchEmployees();
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employee List</Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeeRole}>{item.role}</Text>
            <Text style={styles.employeeHours}>{item.workingHours}</Text>
          </View>
        )}
      />

      <Button title="Add New Employee" onPress={() => navigation.navigate('AddEmployee')} />
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
