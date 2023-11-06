import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MasonryList from "reanimated-masonry-list";
import { useNavigation } from "@react-navigation/native";
import { IPayment, IPayments } from "../../interfaces";
import HorizontalList from "../shared/HorizontalList";
import { itemStyle } from "../../AppStyles";
import PaymentImage from "./PaymentImage";
import { useProduct } from "../../hooks/useProducts";
import { MEDIUMSLATEBLUE } from "../../colors";

export interface IOrderedPayment {
  orderId: number;
  createdDate: string;
  fields: IPayment[];
}

interface IOrderedPayments extends Array<IOrderedPayment> {}

interface IPaymentsView {
  payments: IPayments;
}

const PaymentsView = ({ payments }: IPaymentsView) => {
  const navigation: any = useNavigation();

  const [paymentIndex, setPaymentIndex] = useState(0);
  const [orderedPayments, setOrderedPayments] = useState<IOrderedPayments>([]);
  const [selectedPayment, setSelectedPayment] = useState<IOrderedPayment>();
  const [selectedProductId, setSelectedProuctId] = useState<number>(0);
  const { data: product, refetch: refetchProduct } = useProduct(
    selectedProductId,
  );

  useEffect(() => {
    if (selectedProductId) {
      refetchProduct();
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (product && product.value) {
      setSelectedProuctId(0);
      if (product.value.length === 0) {
        Alert.alert("Information", "The product has already been deleted.");
      } else {
        navigation.navigate("Product", {
          product: product.value[0].fields,
        });
      }
    }
  }, [product]);

  useEffect(() => {
    if (payments) {
      const sortedPayments = groupByOrderId();
      setOrderedPayments(sortedPayments);
    }
  }, [payments]);

  useEffect(() => {
    if (orderedPayments.length > 0) {
      const orderedPaymnet: IOrderedPayment = orderedPayments[paymentIndex];
      //  const orderedPaymnet: IPayment[] = orderedPayments.map(o => o.fields).flat
      setSelectedPayment(orderedPaymnet);
    }
  }, [paymentIndex, orderedPayments]);

  const groupByOrderId = (): IOrderedPayments => {
    const sortedPayments: IOrderedPayments = [];

    payments!.value.forEach((payment) => {
      const orderId: number = payment.fields.OrderId;
      const createdDate: string = new Date(payment.createdDateTime)
        .toLocaleString();

      if (sortedPayments.length > 0) {
        const prevOrder: IOrderedPayment | undefined = sortedPayments.find((
          sp: IOrderedPayment,
        ) => sp.orderId === orderId);

        if (prevOrder) {
          prevOrder.fields.push(payment.fields);
        } else {
          sortedPayments.push({
            orderId,
            createdDate,
            fields: [payment.fields],
          });
        }
      } else {
        sortedPayments.push({ orderId, createdDate, fields: [payment.fields] });
      }
    });

    return sortedPayments;
  };

  const navigate = (index: number) => setPaymentIndex(index);

  const getTotalQuantity = () =>
    selectedPayment?.fields.reduce(
      (total, item) => (item.Qty * item.Price) + total,
      0,
    ).toFixed(2);

  return (
    <>
      {orderedPayments.length === 0 &&
        (
          <View style={styles.emptyPayment}>
            <Text style={styles.message}>You have placed no order.</Text>
          </View>
        )}
      {orderedPayments.length > 0 &&
        (
          <ScrollView>
            <View style={{ marginTop: 5 }}>
              {/* Orders */}
              <HorizontalList
                data={orderedPayments}
                itemIndex={paymentIndex}
                navigate={navigate}
                column="OrderId"
              />
              {/* Order */}
              {selectedPayment &&
                (
                  <>
                    <View style={styles.total}>
                      <Text
                        style={styles.totalText}
                      >
                        ${getTotalQuantity()}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 20 }} />
                    <MasonryList
                      data={selectedPayment.fields}
                      numColumns={selectedPayment.fields.length === 1 ? 1 : 2}
                      contentContainerStyle={{ paddingHorizontal: 12 }}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, i }: any) => (
                        <Pressable
                          style={({ pressed }) => pressed && itemStyle.pressed}
                          onPress={() => {
                            setSelectedProuctId(item.ProductId);
                          }}
                        >
                          <View style={{ padding: 6 }}>
                            <View
                              style={[{
                                aspectRatio: item.AspectRatio,
                              }, itemStyle.imageContainer]}
                            >
                              <PaymentImage payment={item as IPayment} />
                              <View style={{ alignItems: "center", flex: 1 }}>
                                <Text
                                  style={[itemStyle.title, {
                                    fontSize: 16,
                                    marginTop: 3,
                                  }]}
                                >
                                  {item.Title}
                                </Text>
                                <View style={styles.info}>
                                  <Text
                                    style={[itemStyle.title, { fontSize: 14 }]}
                                  >
                                    Qty: {item.Qty}{"  "}Price: ${item.Price}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      )}
                    />
                  </>
                )}
            </View>
          </ScrollView>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  total: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  totalText: {
    fontSize: 24,
    color: MEDIUMSLATEBLUE,
    marginTop: 65,
    zIndex: 1,
  },
  emptyPayment: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 18,
  },
});

export default PaymentsView;
