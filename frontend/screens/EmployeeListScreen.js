import React, { useState, useEffect } from 'react';
import { FlatList, Text, Button, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Per le icone
import { apiBaseUrl } from '../config';

export default function EmployeeListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/companies`);
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
      if (data.length > 0) {
        setSelectedCompany(data[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
      setLoading(false);
    }
  };

  const fetchEmployees = async (companyId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/employees?companyId=${companyId}`);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setLoading(true);
      setError(null);
      fetchEmployees(selectedCompany);
    }
  }, [selectedCompany]);

  const handleEdit = async (employeeId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company details');
      }
      const data = await response.json();

      // Naviga verso lo schermo di modifica passando i dettagli della compagnia
      navigation.navigate('EditEmployee', { employee: data, refreshEmployees: () => fetchEmployees(selectedCompany) });

    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError('Failed to fetch employee details');
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/employees/${employeeId}`, {
        method: 'DELETE', // Metodo DELETE
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Se la richiesta è andata a buon fine, rimuoviamo l'impiegato dalla lista
      fetchEmployees(selectedCompany);
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
          if (companies.length === 0) {
            fetchCompanies();
          } else {
            fetchEmployees(selectedCompany);
          }
        }} />
      </View>
    );
  }

  if (companies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Employees</Text>
        <Text>No companies found. Please add a company first.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employees</Text>

      <Text style={styles.label}>Company:</Text>
      <Picker
        selectedValue={selectedCompany}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCompany(itemValue)}
      >
        {companies.map((comp) => (
          <Picker.Item key={comp._id} label={comp.name} value={comp._id} />
        ))}
      </Picker>

      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleEdit(item._id)} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Add New Employee" onPress={() => navigation.navigate('AddEmployee', { companyId: selectedCompany, refreshEmployees: () => fetchEmployees(selectedCompany) })} />
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
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
