import re, os
import urllib.request

model_path = os.path.join(os.getcwd(), "models", "vicuna-7b-v1.3.ggmlv3.q2_K.bin")

if not os.path.exists(model_path):
    download_url = "https://huggingface.co/localmodels/Vicuna-7B-v1.3-ggml/resolve/main/vicuna-7b-v1.3.ggmlv3.q2_K.bin"
    print(f"Downloading model from: {download_url}")
    urllib.request.urlretrieve(download_url, model_path)


try:
    from llama_cpp import Llama
    llm = Llama(model_path=model_path,n_ctx=512, n_batch=126)
except ImportError:
    print("FAILED TO LOAD LLM")
    llm = None

def get_llm_estimate(title, desc):

    input_string = f"Q: I am attempting the task titled '{title}'"
    if desc != None:
        input_string += f", which has a description '{desc}'" 
    input_string += ". I want an idea how long this will take to complete. In minutes, what is the estimated mean time to complete and the estimated standard deviation time to complete? A: "
    try:
        output = llm(input_string, max_tokens=32, stop=["Q:", "\n"], echo=True)
        # output = llm(f"Q: {input_string}? A: ", max_tokens=256, stop=["Q:", "\n"], echo=True)
        # output = llm(input_string, max_tokens=256, temperature=0.1, top_p=0.5, stop=["#"], echo=False)
        output_text = output['choices'][0]['text'].strip()
    except:
        output_text = "estimated mean : 30 and standard deviation : 5"
    matches = re.findall(r'(\d+(?:\.\d+)?)', output_text)
    if matches:
        try:
            mean = int(matches[-2])
            std_dev = int(matches[-1])
            mean = mean if mean > 10 else 30
            std_dev = std_dev if std_dev < mean else 5
        except:
            mean = 30
            std_dev = 5
    else:
        mean = 30
        std_dev = 5
    print(output_text)
    print(f"Mean {mean}, Std_dev {std_dev}")
    return {"mean": mean, "std_dev" : std_dev}

def get_task_estimate(title, desc):
    return get_llm_estimate(title, desc)