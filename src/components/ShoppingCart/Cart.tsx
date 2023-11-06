import { Alert, StyleSheet, Text, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MasonryList from "reanimated-masonry-list";
import { useCarts, useDeleteCarts } from "../../hooks/useCarts";
import CartItem from "./CartItem";
import { useEffect } from "react";
import HeaderRightIcon from "../shared/HeaderRightIcon";
import { useAddPayment } from "../../hooks/usePayments";
import { IPayment } from "../../interfaces";

const Cart = ({ name }: { name: string }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data: carts, refetch, isRefetching, isFetching } = useCarts(name);
  const deleteCarts = useDeleteCarts(() => {
    refetch();
    Alert.alert("Information", "You have successfully checked out.");
  });

  useEffect(() => {
    refetch();
  }, [isFocused]);

  const onSuccess = () => {
    const delCarts: any[] = [];

    carts!.value.forEach(({ fields }) => {
      delCarts.push({ id: fields.id });
    });
    deleteCarts(delCarts);
  };

  const addPayment = useAddPayment(onSuccess);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: any) => (
        <HeaderRightIcon
          name="shop"
          tintColor={tintColor}
          onPress={() => {
            if (isFetching) {
              Alert.alert("Warning", "Wait... items are loading");
            } else {
              const payments: IPayment[] = [];
              const orderId = +(Math.random() * 1000000000).toFixed(0);

              if (carts!.value.length > 0) {
                carts!.value.forEach(({ fields }) => {
                  const payment: IPayment = {
                    AspectRatio: fields.ProductAspectRatio,
                    Title: fields.Product,
                    Price: fields.ProductPrice,
                    OrderId: orderId,
                    Qty: fields.Qty,
                    ProductId: fields.ProductLookupId,
                    DriveFolder: fields.DriveFolder,
                    DriveId: fields.DriveId,
                    ItemId: fields.ItemId,
                    WebUrl: fields.WebUrl,
                    PrincipalName: fields.PrincipalName,
                  };

                  payments.push(payment);
                });
                addPayment(payments);
              } else {
                Alert.alert("Warning", "Your shopping cart is empty.");
              }
            }
          }}
        />
      ),
    });
  }, [carts, isFetching]);

  return (
    <>
      {carts && carts.value.length === 0 &&
        (
          <View style={styles.emptyCart}>
            <Text style={styles.message}>Your shopping cart is empty.</Text>
          </View>
        )}
      {carts &&
        (
          <MasonryList
            onRefresh={refetch}
            data={carts.value}
            numColumns={1}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: any) => (
              <View style={{ padding: 6 }}>
                <CartItem
                  refetch={refetch}
                  item={item}
                  isRefetching={isRefetching}
                />
              </View>
            )}
            onEndReachedThreshold={0.1}
          />
        )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyCart: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 18,
  },
});

export default Cart;
