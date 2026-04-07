$Content = Get-Content 'live_supabase_schema_utf8.ts' -Raw
$Markdown = '```typescript' + [Environment]::NewLine + $Content + [Environment]::NewLine + '```'
Set-Content -Path 'C:\Users\ASUS\.gemini\antigravity\brain\05652970-6c39-4e05-b4b1-42f66fe9d819\live_supabase_schema.md' -Value $Markdown -Encoding UTF8
