import React, { useState, useEffect } from 'react';
import { FlatList, Text, Button, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Per le icone

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

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/employees/${employeeId}`, {
        method: 'DELETE', // Metodo DELETE
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Se la richiesta è andata a buon fine, rimuoviamo l'impiegato dalla lista
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee');
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
          fetchEmployees();
        }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employees</Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeeRole}>{item.role}</Text>
            <Text style={styles.employeeHours}>{item.workingHours}</Text>

            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  employeeCard: {
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
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  employeeRole: {
    fontSize: 16,
    color: '#666',
  },
  employeeHours: {
    fontSize: 14,
    color: '#999',
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
