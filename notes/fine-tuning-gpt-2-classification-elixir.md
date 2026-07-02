# Fine-Tuning GPT-2 for Classification in Elixir

A walkthrough of fine-tuning a pretrained GPT-2 model for SMS spam classification in Elixir, covering data preparation, model modification, and training.

## Classification vs Instruction Fine-Tuning

Classification fine-tuning targets a narrower task (e.g. spam detection) and needs a smaller dataset than instruction fine-tuning, which teaches models to perform tasks from prompts.

## Data Preparation

The UCI SMS spam dataset is downloaded, balanced by undersampling ham records, and split into train/validation/test sets. The `LlmScratch.FineTuneDataLoader` module handles downloading, loading, balancing, label mapping, and deterministic shuffling using an MT19937 PRNG to match pandas' `random_state` behavior.

## Data Loaders

Variable-length messages are padded to the longest sequence in the batch using GPT-2's end-of-text token ID (50256). The `LlmScratch.SpamDataset` module reads CSVs, tokenizes with Tiktoken, and pads/truncates to a fixed max length.

## Model Modification

The pretrained GPT-2 output head (50,257 vocab) is replaced with a 2-class classification head. The model is frozen, then selective layers are unfrozen for training: the output head, final normalization, and last transformer block.

## Training

The classifier head is trained while most model layers remain frozen. Loss and accuracy are tracked across epochs. EMLX provides Apple GPU support.

> Source: inbox/articles/Fine-tuning for classification  Karlo Šmid Blog.md · processed 2026-07-02
