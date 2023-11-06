import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { usePayments } from "../../hooks/usePayments";
import PaymentsView from "./PaymentsView";

const Payments = ({ name }: { name: string }) => {
  const { data: payments, refetch } = usePayments(name);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {payments &&
        (
          <View style={styles.container}>
            <PaymentsView payments={payments} />
          </View>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flex: 1,
  },
});

export default Payments;
