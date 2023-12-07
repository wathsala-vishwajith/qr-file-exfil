import "./App.css";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { MultiFormatReader } from "@zxing/library";
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
  Image,
  FormErrorMessage,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Field, Formik, Form } from "Formik";
import { useState } from "react";

function App() {
  const url = "http://localhost:5000/upload";

  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.file;
    setFile(selectedFile);
    console.log(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      createChunks(fileContent);
    };

    reader.readAsBinaryString(selectedFile);
  };

  const createChunks = (fileContent) => {
    const chunkSize = 2200; //max is 2400 bytes in version 20 qr
    const totalChunks = Math.ceil(fileContent.length / chunkSize);

    let chunksArray = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;
      const chunk = fileContent.slice(start, end);
      const base64Chunk = btoa(chunk);
      const numberedb64Chunk = `${i + 1}/${totalChunks}:`.concat(base64Chunk);
      chunksArray.push(numberedb64Chunk);
    }

    setChunks(chunksArray);
  };

  const createQR = () => {};

  const reverseAndRecreateFile = () => {
    const reversedChunks = chunks
      .map((base64Chunk) => base64Chunk.split(":").atob(base64Chunk))
      .join("");
    const reversedFileContent = new Blob([reversedChunks], { type: file.type });

    // You can use FileSaver.js or other methods to save the file
    // For simplicity, here we are creating a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(reversedFileContent);
    downloadLink.download = "reversed_file.txt";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

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
                        handleFileChange(values);
                        setTimeout(() => {
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
                            isDisabled={!props.dirty}
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
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {chunks.map((item, idx) => {
            console.log(item);
            return (
              <GridItem id={`qritem-${idx}`} key={idx}>
                <QRCodeCanvas value={item} version={20} level="H" />
              </GridItem>
            );
          })}
        </Grid>
      </Center>
    </VStack>
  );
}

export default App;

