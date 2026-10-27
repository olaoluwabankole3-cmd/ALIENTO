import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import type { Data, Page, TabKey } from "../domain/patient";
export type ScreenProps = { d: Data; patch: (value: Partial<Data>) => void; go: (next: Page) => void; back: () => void; nav: (selected: TabKey) => ReactElement; shell: (title: string, children: ReactNode, selected?: TabKey, dark?: boolean) => ReactElement; voicePreviewActive: boolean; setVoicePreviewActive: Dispatch<SetStateAction<boolean>>; };
