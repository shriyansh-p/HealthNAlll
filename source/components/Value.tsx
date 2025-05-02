import { Image, StyleSheet, Platform, Text, View } from 'react-native';

type ValueProps = {
  label: string;
  value: string;
};

const Value = ({ label, value }: ValueProps) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  label: {
    color: '#333333',
    fontSize: 20
  },
  value: {
    fontSize: 45,
    color: '#157DEC',
    fontWeight: '500'
  }
});

export default Value;