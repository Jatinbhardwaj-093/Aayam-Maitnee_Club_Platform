import json
import glob
import os

brain_dir = '/Users/jatinbhardwaj/.gemini/antigravity-cli/brain/'
log_files = glob.glob(os.path.join(brain_dir, '**/*.jsonl'), recursive=True)

for path in log_files:
    if 'transcript_full.jsonl' not in path:
        continue
    print(f"=== {path} ===")
    with open(path, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'replace_file_content':
                            file = tc['args'].get('TargetFile', '')
                            # Only care about these files
                            if any(x in file for x in ['api.py', 'models.py', 'populate_auditions.py', 'AuditionsCasting.tsx', 'AuditionsManagement.tsx', 'MediaModeration.tsx', 'MemberProfileAudit.tsx']):
                                print(f"FILE EDIT: {file}")
                        elif tc['name'] == 'write_to_file':
                            file = tc['args'].get('TargetFile', '')
                            if any(x in file for x in ['api.py', 'models.py', 'populate_auditions.py', 'AuditionsCasting.tsx', 'AuditionsManagement.tsx', 'MediaModeration.tsx', 'MemberProfileAudit.tsx']):
                                print(f"FILE WRITE: {file}")
                        elif tc['name'] == 'run_command':
                            cmd = tc['args'].get('CommandLine', '')
                            if 'cat <<' in cmd and any(x in cmd for x in ['api.py', 'models.py', 'populate_auditions.py', 'AuditionsCasting.tsx', 'AuditionsManagement.tsx', 'MediaModeration.tsx', 'MemberProfileAudit.tsx']):
                                print(f"CMD SCRIPT:")
                                print(cmd[:200] + '...')
            except Exception:
                pass
