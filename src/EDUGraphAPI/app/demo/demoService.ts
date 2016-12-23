import { Injectable, Inject } from '@angular/core';
import { DemoPage } from './demoPage';

@Injectable()
export class DemoService {

    GetDemoPage(controller: string, action: string, demoPage: DemoPage) {
        //var path = HttpContext.Current.Server.MapPath(dataFilePath);
        //var json = File.ReadAllText(path);
        //var pages = JsonConvert.DeserializeObject<DemoPage[]>(json);

        //var page = pages
        //    .Where(i => i.Controller.IgnoreCaseEquals(controller))
        //    .Where(i => i.Action.IgnoreCaseEquals(action))
        //    .FirstOrDefault();
        //if (page != null) {
        //    var sourceCodeRepositoryUrl = Constants.SourceCodeRepositoryUrl.TrimEnd('/');
        //    foreach(var link in page.Links)
        //    link.Url = sourceCodeRepositoryUrl + link.Url;
        //}
        //return page;
    }

}