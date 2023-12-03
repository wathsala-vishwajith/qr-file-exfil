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
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Formik, Form } from "Formik";

function App() {
  return (
    <VStack h="full" w="full" minH={"100vh"} p={10} alignItems="center">
      <Center flexDirection={"column"}>
        <Center p={10} flexDirection={"column"}>
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
        <Card>
          <CardBody>
            <Tabs minW={345} minH={300} isFitted variant={"enclosed"}>
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
                    <Formik
                      initialValues={{ file: "" }}
                      onSubmit={(values, actions) => {
                        setTimeout(() => {
                          alert(JSON.stringify(values, null, 2));
                          actions.setSubmitting(false);
                        }, 1000);
                      }}
                    >
                      {(props) => (
                        <Form>
                          <Field name="file">
                            {({ field, form }) => (
                              <FormControl>
                                <FormLabel>File</FormLabel>
                                <Input
                                  {...field}
                                  value={undefined} //Hmm fixing the issue where cant set the value programmically
                                  type="file"
                                  accept="audio/*,image/*,video/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,"
                                  onChange={(e) => {
                                    form.setFieldValue(
                                      field.name,
                                      e.currentTarget.files[0]
                                    );
                                  }}
                                />
                                <FormErrorMessage>
                                  {form.errors.name}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                          >
                            Encode
                          </Button>
                        </Form>
                      )}
                    </Formik>
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

