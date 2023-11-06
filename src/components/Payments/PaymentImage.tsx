import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { IPayment } from "../../interfaces";
import { blobToBase64 } from "../../helper";
import { usePaymentImage } from "../../hooks/usePayments";

const PaymentImage = ({ payment }: { payment: IPayment }) => {
  const [image, setImage] = useState<string>();
  const { data: paymentImage } = usePaymentImage(payment);

  useEffect(() => {
    (async () => {
      if (paymentImage) {
        const base64 = await blobToBase64(paymentImage);
        setImage(base64);
      }
    })();
  }, [paymentImage]);

  return (
    <>
      {image &&
        (
          <Image
            source={{
              uri: image,
            }}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        )}
    </>
  );
};

export default PaymentImage;
