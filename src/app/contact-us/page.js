'use client'
import { useEffect, useState, useRef } from "react";
import "./style.css";
import ContactUsFooter from "@/components/ContactUsFooter";
import ContactUsWarning from "@/components/ContactUsWarning";
import ContactUsSubmitLoader from "@/components/ContactUsSubmitLoader";
import emailjs from 'emailjs-com';
import axios from 'axios';
import Compressor from 'compressorjs';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { storage } from "@/firebaseConfig";

const services = [
  "Interface design",
  "Illustration",
  "Brand Identity",
  "Development",
  "Animation",
  "Webflow",
  "3D motion",
];

const Page = () => {
  const formRef = useRef();
  const fileInputRef = useRef(null);
  
  const [selectedServices, setSelectedServices] = useState([]);
  const [files, setFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [isCompressed, setCompressed] = useState(false);
  const [imageUrls, setUrls] = useState([]);
  const [attachmentsCount, setAttachmentsCount] = useState(0);
  const [isWithoutImage, setWithoutImage] = useState(false);
  
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isFail, setFail] = useState(false);
  
  const [client, setClient] = useState({
    from_name: '',
    email: '',
    details: '',
  });

  const webHookUrl = "https://hooks.slack.com/services/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";

  useEffect(() => {
    const appDiv = document.querySelector(".app");
    if (appDiv) {
      appDiv.classList.add("app--white");
    }
    return () => {
      if (appDiv) {
        appDiv.classList.remove("app--white");
      }
    };
  }, []);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const checkFormFilled = () => {
    if (!formRef.current) return false;
    const name = formRef.current.from_name.value.trim();
    const email = formRef.current.email.value.trim();
    const project = formRef.current.details.value.trim();
    return name && email && project;
  };

  const [isFormFilled, setIsFormFilled] = useState(false);

  const handleFormChange = () => {
    setIsFormFilled(checkFormFilled());
  };

  async function onSubmit(event) {
    event.preventDefault();
    handleCompressedUpload();
  }

  // Компрессия файлов
  const handleCompressedUpload = () => {
    console.log('handleCompressedUpload called, files:', files.length);
    if (files.length === 0) {
      console.log('No files, sending without image');
      setLoading(true);
      setWithoutImage(true);
      setCompressed(true);
      return;
    }

    files.map((item, i) => {
      if (item.name.includes('.png') || item.name.includes('.jpg')) {
        new Compressor(item, {
          quality: 0.6,
          success: (compressedResult) => {
            setCompressedFiles((compressedFiles) => [
              ...compressedFiles,
              compressedResult,
            ]);
          },
        });
      } else {
        setCompressedFiles((compressedFiles) => [...compressedFiles, item]);
      }
    });
  };

  // Отправка на почту без файлов
  useEffect(() => {
    emailjs.init('XVlqzmwyk5p21XGJI');
    if (isWithoutImage && isCompressed && client.from_name && client.email) {
      console.log('Sending email without files');
      const templateParams = {
        from_name: client.from_name,
        email: client.email,
        service: selectedServices.join(', '),
        details: client.details,
        files: ''
      };
      emailjs.send('service_o7pozcc', 'template_gnnit8n', templateParams)
        .then(function(response) {
          console.log('Email sent successfully:', response);
          setSuccess(true);
          setLoading(false);
          setWithoutImage(false);
          setCompressed(false);
          setTimeout(() => {
            setSuccess(false);
            formRef.current?.reset();
            setFiles([]);
            setSelectedServices([]);
            setClient({ from_name: '', email: '', details: '' });
          }, 3000);
        }, function(error) {
          console.error('Email sending failed:', error);
          setFail(true);
          setLoading(false);
          setWithoutImage(false);
          setCompressed(false);
          setTimeout(() => {
            setFail(false);
            formRef.current?.reset();
          }, 3000);
        });
    }
  }, [isWithoutImage, isCompressed, client, selectedServices]);

  // Отправка на почту с файлами
  useEffect(() => {
    emailjs.init('XVlqzmwyk5p21XGJI');
    if (imageUrls.length === compressedFiles.length && isCompressed && imageUrls.length > 0) {
      console.log('Sending email with files');
      const templateParams = {
        from_name: client.from_name,
        email: client.email,
        service: selectedServices.join(', '),
        details: client.details,
        files: imageUrls.join(' ')
      };
      console.log('Email params:', templateParams);
      emailjs.send('service_o7pozcc', 'template_gnnit8n', templateParams)
        .then(function(response) {
          console.log('Email sent successfully:', response);
          setSuccess(true);
          setLoading(false);
          setCompressedFiles([]);
          setAttachmentsCount(0);
          setUrls([]);
          setCompressed(false);
          setTimeout(() => {
            setSuccess(false);
            formRef.current?.reset();
            setFiles([]);
            setSelectedServices([]);
            setClient({ from_name: '', email: '', details: '' });
          }, 3000);
        }, function(error) {
          console.error('Email sending failed:', error);
          setFail(true);
          setLoading(false);
          setCompressedFiles([]);
          setAttachmentsCount(0);
          setUrls([]);
          setCompressed(false);
          setTimeout(() => {
            setFail(false);
            formRef.current?.reset();
          }, 3000);
        });
    }
  }, [imageUrls, isCompressed, client, selectedServices, compressedFiles.length]);

  // Загрузка файлов в Firebase
  useEffect(() => {
    if (compressedFiles.length > 0) {
      console.log('Starting Firebase upload, files:', compressedFiles.length);
      compressedFiles.map((item, index) => {
        const storageRef = ref(
          storage,
          `/files/${item.name} + ${Math.random(500)}`
        );
        const uploadTask = uploadBytesResumable(storageRef, item);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setLoading(true);
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(`Upload ${index}: ${progress}%`);
            if (snapshot.bytesTransferred === snapshot.totalBytes && attachmentsCount < files.length) {
              setAttachmentsCount(attachmentsCount => attachmentsCount + 1);
            }
          },
          (error) => {
            console.error('Upload error:', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              console.log('File uploaded, URL:', url);
              setUrls((imageUrls) => [...imageUrls, url.split("token")[0]]);
            });
          }
        );
        if (index === compressedFiles.length - 1) setCompressed(true);
      });
    }
  }, [compressedFiles]);

  // Отправка в Slack без файлов
  useEffect(() => {
    if (isWithoutImage && isCompressed) {
      console.log('Sending to Slack without images');
      const sendToSlackNoFiles = async () => {
        const data = {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "You have received a new application:",
              },
            },
            {
              type: "section",
              block_id: "section789",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Name*\n ${client.from_name}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Email*\n ${client.email}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Details*\n ${client.details}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Services*\n ${selectedServices.join(', ')}`,
                },
              ],
            },
          ],
        };

        try {
          const response = await axios.post(webHookUrl, JSON.stringify(data), {
            withCredentials: false,
            transformRequest: [(data) => data],
          });

          if (response.status === 200) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              formRef.current?.reset();
              setFiles([]);
              setSelectedServices([]);
              setClient({ from_name: '', email: '', details: '' });
            }, 3000);
          } else {
            setFail(true);
            setTimeout(() => {
              setFail(false);
              formRef.current?.reset();
            }, 3000);
          }
        } catch (error) {
          console.error('Slack error:', error);
          setFail(true);
          setTimeout(() => {
            setFail(false);
            formRef.current?.reset();
          }, 3000);
        }

        setLoading(false);
        setWithoutImage(false);
        setAttachmentsCount(0);
      };
      // sendToSlackNoFiles();
    }
  }, [isWithoutImage, isCompressed, client, selectedServices]);

  // Отправка в Slack
  useEffect(() => {
    const sendToSlack = async () => {
      console.log('sendToSlack called', { 
        imageUrls: imageUrls.length, 
        isCompressed, 
        compressedFiles: compressedFiles.length,
        isWithoutImage 
      });
      
      if (imageUrls.length > 0 && isCompressed && imageUrls.length === compressedFiles.length) {
        console.log('Sending to Slack with images');
        const imageUrlsValues = imageUrls.map((item, index) => {
          const imageBlock = {
            type: "section",
            block_id: `section56${index + 7}`,
            text: {
              type: "mrkdwn",
              text: `${item}`,
            },
          };
          return imageBlock;
        });

        const data = {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "You have received a new application:",
              },
            },
            {
              type: "section",
              block_id: "section789",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Name*\n ${client.from_name}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Email*\n ${client.email}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Details*\n ${client.details}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Services*\n ${selectedServices.join(', ')}`,
                },
              ],
            },
            ...imageUrlsValues,
          ],
        };

        try {
          const response = await axios.post(webHookUrl, JSON.stringify(data), {
            withCredentials: false,
            transformRequest: [(data) => data],
          });
          
          if (response.status === 200) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              formRef.current?.reset();
              setFiles([]);
              setSelectedServices([]);
              setClient({ from_name: '', email: '', details: '' });
            }, 3000);
          } else {
            setFail(true);
            setTimeout(() => {
              setFail(false);
              formRef.current?.reset();
            }, 3000);
          }
        } catch (error) {
          setFail(true);
          setTimeout(() => {
            setFail(false);
            formRef.current?.reset();
          }, 3000);
        }
        
        setLoading(false);
        setCompressedFiles([]);
        setAttachmentsCount(0);
        setUrls([]);
      }

      if (isWithoutImage) {
        console.log('Sending to Slack without images');
        const data = {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "You have received a new application:",
              },
            },
            {
              type: "section",
              block_id: "section789",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Name*\n ${client.from_name}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Email*\n ${client.email}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Details*\n ${client.details}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Services*\n ${selectedServices.join(', ')}`,
                },
              ],
            },
          ],
        };

        try {
          const response = await axios.post(webHookUrl, JSON.stringify(data), {
            withCredentials: false,
            transformRequest: [(data) => data],
          });
          
          if (response.status === 200) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              formRef.current?.reset();
              setFiles([]);
              setSelectedServices([]);
              setClient({ from_name: '', email: '', details: '' });
            }, 3000);
          } else {
            setFail(true);
            setTimeout(() => {
              setFail(false);
              formRef.current?.reset();
            }, 3000);
          }
        } catch (error) {
          setFail(true);
          setTimeout(() => {
            setFail(false);
            formRef.current?.reset();
          }, 3000);
        }
        
        setLoading(false);
        setWithoutImage(false);
        setAttachmentsCount(0);
      }
    };

    if ((imageUrls.length > 0 && isCompressed && imageUrls.length === compressedFiles.length) || isWithoutImage) {
      // sendToSlack();
    }
  }, [imageUrls, isCompressed, isWithoutImage, client, selectedServices, compressedFiles.length]);

  function onClose() {
    setFail(false);
    setSuccess(false);
  }

  return (
    <article className="contact-us">
      <div className="contact-us__container">
        <h1 className="contact-us__title">Write to Renua</h1>
        <p className="contact-us__descr">We&apos;d love to hear from you and your team</p>

        <div className="contact-us__services">
          {services.map((service) => (
            <button
              key={service}
              type="button"
              className={`contact-us__service${
                selectedServices.includes(service)
                  ? " contact-us__service--active"
                  : ""
              }`}
              onClick={() => toggleService(service)}
            >
              {service}
            </button>
          ))}
        </div>

        <form className="contact-us__form" ref={formRef} onSubmit={onSubmit}>
          <div className="contact-us__field">
            <input
              type="text"
              id="from_name"
              name="from_name"
              className="contact-us__input"
              placeholder="Your name"
              onChange={(e) => {
                handleInputChange(e);
                handleFormChange();
              }}
              required
            />
            <label htmlFor="from_name" className="contact-us__label">Your name</label>
          </div>

          <div className="contact-us__field">
            <input
              type="email"
              id="email"
              name="email"
              className="contact-us__input"
              placeholder="Email"
              onChange={(e) => {
                handleInputChange(e);
                handleFormChange();
              }}
              required
            />
            <label htmlFor="email" className="contact-us__label">Email</label>
          </div>

          <div className="contact-us__field contact-us__field--textarea">
            <textarea
              id="details"
              name="details"
              className="contact-us__input contact-us__textarea"
              placeholder="Please tell us about your project"
              onChange={(e) => {
                handleInputChange(e);
                handleFormChange();
              }}
              rows={4}
              required
            />
            <label htmlFor="details" className="contact-us__label">Please tell us about your project</label>
          </div>

          <div className="contact-us__file">
            <button
              type="button"
              className="contact-us__file-label"
              onClick={triggerFileInput}
            >
              <span className="contact-us__file-plus">+</span>
              Click to choose a file
            </button>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              className="contact-us__file-input"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.rar"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="contact-us__file-list">
              <label className="contact-us__file-list-label">Attachment</label>
              <ul className="contact-us__file-items">
                {files.map((file, index) => (
                  <li key={index} className="contact-us__file-item">
                    <span
                      className="contact-us__file-x"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </span>
                    <span className="contact-us__file-name">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className={`contact-us__submit${!isFormFilled ? " contact-us__submit--disabled" : ""}`}
            disabled={!isFormFilled}
          >
            Submit
          </button>
        </form>
      </div>
      <ContactUsFooter />
      {isLoading && <ContactUsSubmitLoader attachmentsCount={attachmentsCount} files={files} />}
      {isSuccess ? (
        <ContactUsWarning
          onClose={onClose}
          title="Thank you!"
          description="We will contact you within 12 hours."
          type="success"
        />
      ) : isFail ? (
        <ContactUsWarning
          onClose={onClose}
          title="Oops. File error!"
          description="The file was not uploaded - 20 mb max."
          type="error"
        />
      ) : null}
    </article>
  );
};

export default Page;
