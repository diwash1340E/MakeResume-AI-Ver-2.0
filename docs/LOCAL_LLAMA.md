# Local Llama experiment (optional, separate from ResuMeow)

Llama is Meta's open-weight model family. Ollama runs downloaded weights on your computer; it is not the model. Install Ollama from https://ollama.com/download. In a terminal:

```cmd
ollama run llama3.2:3b
```

The 3B model is a lightweight baseline; for more capability test `ollama run llama3.1:8b` if memory permits. Downloads are roughly 2 GB and 4.9 GB respectively, but runtime needs extra memory for context. `ollama ps` reports running models and CPU/GPU placement. Keep the local API on loopback (127.0.0.1:11434).

Create a file named Modelfile (no .txt extension):
```
FROM llama3.2:3b
PARAMETER temperature 0.2
PARAMETER num_ctx 4096
SYSTEM """
You are a careful career assistant. Use only facts supplied by the user.
Never invent experience, skills, dates or metrics. Separate verified edits from suggestions.
"""
```
Run `ollama create resumeow-local -f Modelfile` then `ollama run resumeow-local`.
This customizes the system prompt and inference parameters; it is not training.
For private knowledge, add retrieval (RAG) from local documents at request time.
For training, investigate supervised fine-tuning with LoRA/QLoRA in a separate GPU environment and export compatible weights or adapters. Evaluate on held-out examples. Check the base model license before distributing.

References: https://docs.ollama.com/modelfile and https://ollama.com/library/llama3.2 and https://ollama.com/library/llama3.1.
This is a standalone experiment. The ResuMeow application uses Gemini only.
