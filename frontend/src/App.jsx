import "./App.css";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { MultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
// import axios from "axios";

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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Field, Formik, Form } from "formik";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);

  //camera
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  // const [videoStream, setVideoStream] = useState(null);

  const handleDevices = useCallback(
    (mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      setDevices(videoDevices);

      // If no device is selected or the selected device is not available, choose the first available device
      if (
        !selectedDeviceId ||
        !videoDevices.some((device) => device.deviceId === selectedDeviceId)
      ) {
        setSelectedDeviceId(
          videoDevices.length > 0 ? videoDevices[0].deviceId : null
        );
      }
    },
    [selectedDeviceId]
  );

  const stopVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    // setVideoStream(null);
    setPermissionsGranted(false);
    // if (videoStream) {
    //   const tracks = videoStream.getTracks();
    //   tracks.forEach((track) => track.stop());
    //   setVideoStream(null);
    //   setPermissionsGranted(false);
    // }
  };

  const startVideo = (deviceID) => {
    setSelectedDeviceId(deviceID);
    setPermissionsGranted(true);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
    handlePermission();
  }, [handleDevices]);

  const handlePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      // setVideoStream(stream);
      setPermissionsGranted(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  //files

  const handleFileChange = (e) => {
    const selectedFile = e.file;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      // console.log(event);
      const fileContent = event.target.result;
      createChunks(selectedFile, fileContent);
    };

    reader.readAsBinaryString(selectedFile);
  };

  const createChunks = (file, fileContent) => {
    const chunkSize = 2000; //max is 2400 bytes in version 20 qr
    const totalChunks = Math.ceil(fileContent.length / chunkSize);
    console.log(file);
    let chunksArray = [];

    //create file infomation first
    // name
    // type
    // number of chunks

    const fileMime = {
      name: file.name,
      type: file.type,
      chunks: totalChunks,
      size: file.size,
    };
    // console.log(JSON.parse(atob(btoa(JSON.stringify(fileMime)))));
    //first qr with file information

    const fileInfo = `${0}/${totalChunks}==`.concat(
      btoa(JSON.stringify(fileMime))
    );
    chunksArray.push(fileInfo);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;
      const chunk = fileContent.slice(start, end);
      const base64Chunk = btoa(chunk);
      const numberedb64Chunk = `${i + 1}/${totalChunks}==`.concat(base64Chunk);
      chunksArray.push(numberedb64Chunk);
    }

    setChunks(chunksArray);
  };

  // const createQR = () => {};

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
          <Heading as="h3" size="md">
            Logless file extraction for auditable devices.{" "}
          </Heading>
          <Heading as="h3" size="sm">
            First Create the QRs, then use the decoder to recreate the file on
            an another device.{" "}
          </Heading>
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
                  {permissionsGranted ? (
                    <>
                      {selectedDeviceId && (
                        <div key={selectedDeviceId}>
                          <Webcam
                            audio={false}
                            videoConstraints={{ deviceId: selectedDeviceId }}
                            key={selectedDeviceId}
                          />
                          {devices.map((device, key) => (
                            <Button
                              key={key}
                              onClick={() =>
                                setSelectedDeviceId(device.deviceId)
                              }
                              disabled={device.deviceId === selectedDeviceId}
                            >
                              Select Camera{" "}
                              {device.label || `Device ${key + 1}`}
                            </Button>
                          ))}
                          <Button onClick={stopVideo}>Stop</Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p>
                        Camera permissions are required to use this feature.{" "}
                        <br></br>
                        Try Pressing Start on available devices.
                      </p>
                      {devices.map((device, key) => (
                        <Button
                          key={key}
                          onClick={() => startVideo(device.deviceId)}
                          // setSelectedDeviceId(device.deviceId)}
                        >
                          Select Camera {device.label || `Device ${key + 1}`}
                        </Button>
                      ))}
                    </>
                  )}
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

