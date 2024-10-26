from utils import get_som_labeled_img, check_ocr_box, get_caption_model_processor, get_yolo_model
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from openai import OpenAI
from  ultralytics import YOLO
import io
import torch
import base64
import matplotlib.pyplot as plt




OPENAI_API_KEY = "ENTER_YOUR_OPEN_AI_KEY"

OpenAI.api_key = OPENAI_API_KEY

print(OPENAI_API_KEY)

app = FastAPI()
client = OpenAI(api_key=OPENAI_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/")

async def upload(file: UploadFile = File(...), origin:str = Form(...)):
    # Read the image file
    image_data = await file.read()
    
    # Process the image using Pillow

    image = Image.open(io.BytesIO(image_data))

    img_path = "test.png"
    base64_image = base64.b64encode(image_data).decode('utf-8')

    image.save(img_path)

    print("Parsing")

    content = await screen_parse(img_path)
    content_string = " ".join(content)
    instructions = "The following text is a deconstruction of a UI by an user. Your job is to decide from the interface if the user is in a malicious site or is at risk of sharing critical informaiton. The URL is" + origin + "so use it to check if it's pishing website. If you find a conversation (in email or a chatting app) check if the sender is requesting personal data and warn the user if so. Be wary of conversations asking for persnal info, such as passwords or other personal data. Be wary of pages selling videogame hacks or pirating media. You answer will be strictly in a JSON format with two properties. securityStatus that can be three possible outputs: safe, unsafe or unsure. And a reason property explaning the why. Write your result in Spanish except for the json" + content_string
    print("Parsed Successfully")

    # ChatGPT prompting

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": instructions},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url":  f"data:image/jpeg;base64,{base64_image}"
                        }
                    },
                ],
            }
        ],
        max_tokens=300,
    )

    reply_content = response.choices[0].message.content
    print(reply_content)

    return JSONResponse(content=reply_content, status_code=200)

    

async def screen_parse(img_path):

    device = 'cuda'
    torch.cuda.empty_cache()
    som_model = get_yolo_model(model_path='Omniparser/model/icon_detect/best.pt')
    som_model.to(device)

    caption_model_processor = get_caption_model_processor(model_name="florence2", model_name_or_path="Omniparser/model/icon_caption_florence", device=device)
    som_model.device, type(som_model) #, type(dino_model['model']), isinstance(som_model, YOLO) dino_model['model'].device, 

    cnt = 0
    image_path = img_path
    draw_bbox_config = {
        'text_scale': 0.8,
        'text_thickness': 2,
        'text_padding': 3,
        'thickness': 3,
    }
    BOX_TRESHOLD = 0.03

    image = Image.open(image_path)
    image_rgb = image.convert('RGB')

    ocr_bbox_rslt, is_goal_filtered = check_ocr_box(image_path, display_img = False, output_bb_format='xyxy', goal_filtering=None, easyocr_args={'paragraph': False, 'text_threshold':0.9})
    text, ocr_bbox = ocr_bbox_rslt

    dino_labled_img, label_coordinates, parsed_content_list = get_som_labeled_img(image_path, som_model, BOX_TRESHOLD = BOX_TRESHOLD, output_coord_in_ratio=False, ocr_bbox=ocr_bbox,draw_bbox_config=draw_bbox_config, caption_model_processor=caption_model_processor, ocr_text=text,use_local_semantics=True, iou_threshold=0.1)

    print(parsed_content_list)
    return parsed_content_list
