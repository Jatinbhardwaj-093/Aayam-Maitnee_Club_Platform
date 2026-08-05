from ai.audition_analyzer import AuditionAnalyzer

analyzer = AuditionAnalyzer()

report = analyzer.analyze("uploads/videos/test.mp4")

print(report)