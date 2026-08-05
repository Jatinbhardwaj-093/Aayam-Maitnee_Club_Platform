from ai.report_service import ReportService

report = ReportService()

result = report.generate_report(
    transcript="""
Hello, my name is Devi.
I am auditioning for the role of Juliet.
""",
    blur=245.8,
    brightness=160.3,
    face_detected=True
)

print(result)