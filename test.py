import os
os.environ['TGRM_TKN'] = "TEST"

from bot import _transform_link
print(_transform_link("תיק 4000 קרס? כך נלחם העליון בפייק ניוז על תיקי נתניהוhttps://www.themarker.com/law/2022-08-28/ty-article/.premium/00000182-dfaa-d9c0-a3d3-ffba90f60000?utm_source=App_Share&utm_medium=Android_Native&utm_campaign=Share"))
print(_transform_link("https://www.themarker.com/law/2022-08-28/ty-article/.premium/00000182-dfaa-d9c0-a3d3-ffba90f60000?utm_source=App_Share&utm_medium=Android_Native&utm_campaign=Share"))