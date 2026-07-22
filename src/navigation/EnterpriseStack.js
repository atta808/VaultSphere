import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';

// Screens
import { EnterpriseDashboard } from '../screens/enterprise/EnterpriseDashboard';
import { RecordsManager } from '../screens/enterprise/RecordsManager';
import { RetentionPoliciesScreen } from '../screens/enterprise/RetentionPoliciesScreen';
import { LegalHoldsScreen } from '../screens/enterprise/LegalHoldsScreen';
import { ComplianceCenter } from '../screens/enterprise/ComplianceCenter';
import { OrganizationManager } from '../screens/enterprise/OrganizationManager';
import { DepartmentManager } from '../screens/enterprise/DepartmentManager';
import { RoleManager } from '../screens/enterprise/RoleManager';
import { TeamManager } from '../screens/enterprise/TeamManager';
import { GovernanceRules } from '../screens/enterprise/GovernanceRules';
import { AdministrationCenter } from '../screens/enterprise/AdministrationCenter';
import { ComplianceReports } from '../screens/enterprise/ComplianceReports';

const Stack = createNativeStackNavigator();

export const EnterpriseStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.ENTERPRISE_DASHBOARD}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name={ROUTES.ENTERPRISE_DASHBOARD} component={EnterpriseDashboard} options={{ title: 'Enterprise Dashboard' }} />
      <Stack.Screen name={ROUTES.RECORDS_MANAGER} component={RecordsManager} options={{ title: 'Records Manager' }} />
      <Stack.Screen name={ROUTES.RETENTION_POLICIES} component={RetentionPoliciesScreen} options={{ title: 'Retention Policies' }} />
      <Stack.Screen name={ROUTES.LEGAL_HOLDS} component={LegalHoldsScreen} options={{ title: 'Legal Holds' }} />
      <Stack.Screen name={ROUTES.COMPLIANCE_CENTER} component={ComplianceCenter} options={{ title: 'Compliance Center' }} />
      <Stack.Screen name={ROUTES.ORGANIZATION_MANAGER} component={OrganizationManager} options={{ title: 'Organization Manager' }} />
      <Stack.Screen name={ROUTES.DEPARTMENT_MANAGER} component={DepartmentManager} options={{ title: 'Department Manager' }} />
      <Stack.Screen name={ROUTES.ROLE_MANAGER} component={RoleManager} options={{ title: 'Role Manager' }} />
      <Stack.Screen name={ROUTES.TEAM_MANAGER} component={TeamManager} options={{ title: 'Team Manager' }} />
      <Stack.Screen name={ROUTES.GOVERNANCE_RULES} component={GovernanceRules} options={{ title: 'Governance Rules' }} />
      <Stack.Screen name={ROUTES.ADMINISTRATION_CENTER} component={AdministrationCenter} options={{ title: 'Administration Center' }} />
      <Stack.Screen name={ROUTES.COMPLIANCE_REPORTS} component={ComplianceReports} options={{ title: 'Compliance Reports' }} />
    </Stack.Navigator>
  );
};

export default EnterpriseStack;
