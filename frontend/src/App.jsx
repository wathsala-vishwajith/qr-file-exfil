import "./App.css";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import {
  Card,
  CardBody,
  Center,
  Heading,
  TabList,
  Tabs,
  Tab,
  VStack,
  TabPanels,
  TabPanel,
  Input,
  TabIndicator,
  Button,
  flexbox,
} from "@chakra-ui/react";

function App() {
  return (
    <VStack h="full" w="full" p={10} alignItems="flex-start">
      <Center flexDirection={"column"}>
        <Center flexDirection={"column"}>
          <QRCodeSVG
            value={"qr-file-exfil"}
            size={128}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
          <Heading color={"lightskyblue"}>qr-file-exfil</Heading>
        </Center>
        <Card minW={120}>
          <CardBody>
            <Tabs minW={100} isFitted variant={"enclosed"}>
              <TabList>
                <Tab>Encode</Tab>
                <Tab>Decode</Tab>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel p={10}>
                  <Center>
                    <Input
                      type="file"
                      accept="audio/*,image/*,video/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,"
                    />
                    <Button>Encode</Button>
                  </Center>
                </TabPanel>
                <TabPanel>
                  <p>Decode</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Center>
    </VStack>
  );
}

export default App;

