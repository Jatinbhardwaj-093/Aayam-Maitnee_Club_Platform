import json

transcript_path = '/Users/jatinbhardwaj/.gemini/antigravity-cli/brain/019c5c31-7628-47e6-bf8e-bbfe8d794c2e/.system_generated/logs/transcript_full.jsonl'
with open(transcript_path, 'r') as f:
    lines = f.readlines()

for line in lines:
    try:
        data = json.loads(line)
        if 'tool_calls' in data:
            for tc in data['tool_calls']:
                if 'args' in tc and isinstance(tc['args'], dict):
                    if 'TargetFile' in tc['args']:
                        file = tc['args']['TargetFile']
                        if 'AuditionsCasting.tsx' in file:
                            # Print the replacement diff so I can manually patch it
                            print(tc['args'].get('TargetContent', ''))
                            print("------------------")
                            print(tc['args'].get('ReplacementContent', ''))
                            print("==================")
                        if 'populate_auditions.py' in file:
                            # It could be write_to_file or replace_file_content
                            if 'CodeContent' in tc['args']:
                                with open('backend/scripts/populate_auditions.py', 'w') as f2:
                                    f2.write(tc['args']['CodeContent'])
                            elif 'ReplacementContent' in tc['args']:
                                # Ignore small replaces for now
                                pass
    except Exception as e:
        pass
