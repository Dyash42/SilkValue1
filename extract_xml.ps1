[xml]$Docx = Get-Content "PRD_Extracted\word\document.xml"
$Namespaces = @{ w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main" }
$Paragraphs = $Docx.SelectNodes("//w:p", $Namespaces)

$Output = @()
foreach ($P in $Paragraphs) {
    $TextNodes = $P.SelectNodes(".//w:t", $Namespaces)
    if ($TextNodes) {
        $ParaText = ($TextNodes | ForEach-Object { $_.InnerText }) -join ""
        $Output += $ParaText
    }
}

$Output | Out-File -FilePath "prd_clean_text.txt" -Encoding UTF8
