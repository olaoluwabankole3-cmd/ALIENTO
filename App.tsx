import { CareProvider } from "./src/care/CareConnection";
import React, { useEffect, useState } from "react";
import { BackHandler, Platform, SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import { BottomNav, Top } from "./src/components/ui";
import { C } from "./src/theme/tokens";
import s from "./src/theme/styles";
import { initial } from "./src/domain/patient";
import type { Data, Page, TabKey } from "./src/domain/patient";
import { getTabDestination } from "./src/navigation/routes.mjs";
import type { ScreenProps } from "./src/screens/types";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { VoiceScreen } from "./src/screens/VoiceScreen";
import { FollowUpScreen } from "./src/screens/FollowUpScreen";
import { SummaryScreen } from "./src/screens/SummaryScreen";
import { ConsentScreen } from "./src/screens/ConsentScreen";
import { PendingScreen } from "./src/screens/PendingScreen";
import { CarePlanScreen } from "./src/screens/CarePlanScreen";
import { PharmacyScreen } from "./src/screens/PharmacyScreen";
import { OrderScreen } from "./src/screens/OrderScreen";
import { DeliveryScreen } from "./src/screens/DeliveryScreen";
import { DropzoneScreen } from "./src/screens/DropzoneScreen";
import { MyCareScreen } from "./src/screens/MyCareScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { UrgentScreen } from "./src/screens/UrgentScreen";
const SCREEN_BY_PAGE: Record<Page, React.ComponentType<ScreenProps>> = {
  welcome: WelcomeScreen,
  home: HomeScreen,
  voice: VoiceScreen,
  followup: FollowUpScreen,
  summary: SummaryScreen,
  consent: ConsentScreen,
  pending: PendingScreen,
  careplan: CarePlanScreen,
  pharmacy: PharmacyScreen,
  order: OrderScreen,
  delivery: DeliveryScreen,
  dropzone: DropzoneScreen,
  mycare: MyCareScreen,
  profile: ProfileScreen,
  urgent: UrgentScreen,
};
export default function App() {
 return <CareProvider>{Platform.OS === "web" ? (
   <View style={{ flex: 1, alignItems: "center", backgroundColor: "#EAF0ED" }}>
     <View style={{ flex: 1, width: "100%", maxWidth: 520, backgroundColor: C.canvas, shadowColor: C.ink, shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 4 } }}>
       <PatientApp />
     </View>
   </View>
 ) : <PatientApp />}</CareProvider>;
}
function PatientApp() {
 const [page,setPage]=useState<Page>("welcome");
 const [history,setHistory]=useState<Page[]>([]);
 const [voicePreviewActive,setVoicePreviewActive]=useState(false);
 const [d,setD]=useState<Data>(initial);
 const patch=(value:Partial<Data>)=>setD(old=>({...old,...value}));
 const go=(next:Page)=>{setHistory(old=>[...old,page]);setPage(next);};
 const previousPage = history[history.length - 1];
 const back = React.useCallback(() => {
   if (previousPage) {
     setPage(previousPage);
     setHistory(old => old.slice(0, -1));
   } else {
     setPage("home");
   }
 }, [previousPage]);
 useEffect(() => {
   if (Platform.OS !== "android") return;
   const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
     if (!previousPage && (page === "welcome" || page === "home")) return false;
     back();
     return true;
   });
   return () => subscription.remove();
 }, [page, previousPage, back]);
 const tab=(selected:TabKey)=>{setHistory([]);setPage(getTabDestination(selected));};
 const nav=(selected:TabKey)=><BottomNav selected={selected} onSelect={tab}/>;
 const shell=(title:string,children:React.ReactNode,selected?:TabKey,dark=false)=><SafeAreaView style={[s.safe,{backgroundColor:dark?C.ink:C.canvas}]}><StatusBar barStyle={dark?"light-content":"dark-content"} backgroundColor={dark?C.ink:C.canvas}/><Top title={title} back={back} dark={dark}/><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[s.content,selected&&{paddingBottom:20}]}>{children}</ScrollView>{selected?nav(selected):null}</SafeAreaView>;
 const screenProps:ScreenProps={d,patch,go,back,nav,shell,voicePreviewActive,setVoicePreviewActive};
 const Screen=SCREEN_BY_PAGE[page];
 return <Screen {...screenProps}/>;
}
