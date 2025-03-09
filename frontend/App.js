import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddEmployeeScreen from './screens/AddEmployeeScreen';
import EmployeeListScreen from './screens/EmployeeListScreen';
import AddCompanyScreen from './screens/AddCompanyScreen';
import CompaniesListScreen from './screens/CompaniesListScreen';
import EditCompanyScreen from './screens/EditCompanyScreen';
import EditEmployeeScreen from './screens/EditEmployeeScreen';
import { Ionicons } from '@expo/vector-icons'; // Per le icone del menu

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack per Employees
function EmployeeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Employees" component={EmployeeListScreen} />
      <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} />
      <Stack.Screen name="EditEmployee" component={EditEmployeeScreen} />
    </Stack.Navigator>
  );
}

// Stack per Companies
function CompanyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Companies" component={CompaniesListScreen} />
      <Stack.Screen name="AddCompany" component={AddCompanyScreen} />
      <Stack.Screen name="EditCompany" component={EditCompanyScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Employees") {
              iconName = "people-outline";
            } else if (route.name === "Companies") {
              iconName = "business-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Employees" component={EmployeeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Companies" component={CompanyStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
