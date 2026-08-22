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
                    if 'CommandLine' in tc['args']:
                        cmd = tc['args']['CommandLine']
                        if 'AuditionsManagement.tsx' in cmd or 'AuditionsCasting.tsx' in cmd or 'populate_auditions.py' in cmd:
                            print(cmd)
                    if 'TargetFile' in tc['args']:
                        file = tc['args']['TargetFile']
                        if 'AuditionsManagement.tsx' in file or 'AuditionsCasting.tsx' in file or 'populate_auditions.py' in file:
                            print(f"REPLACE IN {file}:")
                            print(tc['args'].get('ReplacementContent', ''))
    except Exception as e:
        pass
