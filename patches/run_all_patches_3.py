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
                    if tc['name'] == 'replace_file_content':
                        file_path = tc['args'].get('TargetFile')
                        target = tc['args'].get('TargetContent')
                        replacement = tc['args'].get('ReplacementContent')
                        if file_path and target and replacement:
                            try:
                                with open(file_path, 'r') as f_read:
                                    content = f_read.read()
                                content = content.replace(target, replacement)
                                with open(file_path, 'w') as f_write:
                                    f_write.write(content)
                                print(f"Patched {file_path}")
                            except Exception as e:
                                print(f"Error patching {file_path}: {e}")
                    elif tc['name'] == 'write_to_file':
                        file_path = tc['args'].get('TargetFile')
                        content = tc['args'].get('CodeContent')
                        if file_path and content:
                            if 'populate_auditions.py' in file_path:
                                try:
                                    with open(file_path, 'w') as f_write:
                                        f_write.write(content)
                                    print(f"Wrote {file_path}")
                                except Exception as e:
                                    print(f"Error writing {file_path}: {e}")
                    elif tc['name'] == 'run_command':
                        cmd = tc['args'].get('CommandLine', '')
                        if 'sed -i' in cmd and 'MemberProfileAudit.tsx' in cmd:
                            # Not going to blindly run bash, but I know what happened there
                            pass
    except Exception as e:
        pass
