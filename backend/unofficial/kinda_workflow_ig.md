Ignore kardo :)



#1 - frontend stuff

-option for uploading file from local device.
-option for number of ques 
-figure out input stuff for file uploading. the rest is text and states
-somehow need to send these inputs and loaded file to backend
-on submit/generate respective inputs needs to be judged and sent to backend for processing 


#2 - backend entry

-kinda recieve the request from frontend side (file and other variables)
-extract text from validated uploaded file and clean up the raw text to forward to llm
-client invoked to generate relevant output in a specified JSON format
-send the output back to frontend


#3 - frontend output

-recieve output json and render components accordingly
-handle quiz scoring functionality
-display score and highlight correct/incorrect responses upon submission
-option to clear/reset - reverts to initial render state


-additionally integrate an option to convert output to a .csv file and download it on the local device (figure out later)
