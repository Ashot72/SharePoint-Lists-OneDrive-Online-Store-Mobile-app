import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUsers";
import Payments from "../../components/Payments/Payments";
import { DrawerStackScreenProps } from "../../navigators/DrawerNavigator";

const PaymentsScreen = ({}: DrawerStackScreenProps<"Payments">) => {
  const [name, setName] = useState<string>("");
  const user = useUser();

  useEffect(() => {
    if (user) {
      setName(user.userPrincipalName);
    }
  }, [user]);

  return (
    <>
      {name &&
        <Payments name={name} />}
    </>
  );
};

export default PaymentsScreen;
