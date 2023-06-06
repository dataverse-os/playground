import { Model } from "@/types";
import { useEffect, useState } from "react";
import app from "@/output/app.json";

export const useModel = () => {
    const [postModel, setPostModel] = useState<Model>({
        modelName: "",
        modelId: "",
        isPublicDomain: false,
    });

    useEffect(() => {
        setPostModel(
            // app.models.find(
            //   (model) => model.name === `${app.createDapp.slug}_post`
            // ) as Model
            Object.values(app.models).find((model) => model.modelName === 'playground_post') as Model
        );
    }, []);

    return {
        postModel
    }
}